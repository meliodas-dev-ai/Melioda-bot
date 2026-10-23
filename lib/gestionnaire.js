import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import config from '../config.js'
import { contexte, lire, ecrire, effacer } from './db.js'
import { habiller } from './style.js'
import { verifierAcces } from './acces.js'
import { brancherEvenements } from './evenements.js'

const DOSSIER = (process.env.DATA_DIR || '.') + '/sessions'
const MAX_EN_ATTENTE = 20
const INTERDITES = new Set(['shutdown.js', 'restart.js', 'setbanner.js', 'systeminfo.js'])
const sessions = new Map()
const commandes = new Map()

export async function chargerCommandes() {
  for (const f of fs.readdirSync('commands').filter((f) => f.endsWith('.js') && !INTERDITES.has(f))) {
    try {
      const mod = await import(pathToFileURL(path.resolve('commands', f)).href)
      const cmd = mod.default
      commandes.set(cmd.nom, cmd)
      for (const a of cmd.alias || []) commandes.set(a, cmd)
    } catch (e) {
      console.log('❌ Commande ignorée :', f, '-', e.message)
    }
  }
  console.log('📦 Commandes chargées :', new Set([...commandes.values()].map((c) => c.nom)).size)
}

function supprimer(numero) {
  const e = sessions.get(numero)
  sessions.delete(numero)
  try {
    e?.sock.end(undefined)
  } catch {}
  fs.rmSync(path.join(DOSSIER, numero), { recursive: true, force: true })
  effacer(numero)
  console.log('🗑️ Session supprimée :', numero)
}

function estLiee(numero) {
  try {
    const creds = JSON.parse(fs.readFileSync(path.join(DOSSIER, numero, 'creds.json'), 'utf8'))
    return creds.registered === true
  } catch {
    return false
  }
}

async function demarrer(numero, avecCode = false) {
  const { state, saveCreds } = await useMultiFileAuthState(path.join(DOSSIER, numero))
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
  })
  const entree = { sock, state, connecte: false }
  sessions.set(numero, entree)

  const surEvenement = sock.ev.on.bind(sock.ev)
  sock.ev.on = (evt, fn) => surEvenement(evt, (...a) => contexte.run({ compte: numero }, () => fn(...a)))
  const envoi = sock.sendMessage.bind(sock)
  sock.sendMessage = (j, c, o) => envoi(j, habiller(c), o)

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      entree.connecte = true
      if (lire('mode', null) === null) ecrire('mode', { prive: true })
      console.log('✅ Session connectée :', numero)
    }
    if (connection === 'close') {
      entree.connecte = false
      const statut = lastDisconnect?.error?.output?.statusCode
      if (statut === DisconnectReason.loggedOut) return supprimer(numero)
      if (sessions.get(numero) !== entree) return
      if (state.creds.registered || statut === DisconnectReason.restartRequired) {
        setTimeout(() => demarrer(numero).catch((e) => console.log('⚠️ Reconnexion -', e.message)), 3000)
      }
    }
  })

  brancherEvenements(sock, config)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg?.message) return
    const jid = msg.key.remoteJid
    const texte = (
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      ''
    ).trim()
    if (!texte.startsWith(config.prefix)) return
    const [nom, ...args] = texte.slice(config.prefix.length).trim().split(/\s+/)
    const cmd = commandes.get(nom.toLowerCase())
    if (!cmd) return
    const refus = verifierAcces(msg)
    if (refus) {
      if (refus === 'maintenance') await sock.sendMessage(jid, { text: '🛠️ Le bot est en maintenance. Réessaie plus tard.' })
      return
    }
    try {
      await cmd.run({ sock, msg, jid, args, commandes, config })
    } catch (e) {
      console.log('⚠️ Erreur dans .' + nom, '-', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Une erreur est survenue avec cette commande.' }).catch(() => {})
    }
  })

  setTimeout(() => {
    if (!state.creds.registered && sessions.get(numero) === entree) supprimer(numero)
  }, 10 * 60 * 1000)

  if (avecCode && !state.creds.registered) {
    await new Promise((r) => setTimeout(r, 3000))
    return await sock.requestPairingCode(numero)
  }
}

export async function demarrerAvecCode(numero) {
  if (estLiee(numero) || sessions.get(numero)?.state.creds.registered) throw new Error('DEJA_LIE')
  if (sessions.has(numero)) supprimer(numero)
  if (sessions.size >= Number(process.env.MAX_COMPTES || 50)) throw new Error('SATURE')
  const enAttente = [...sessions.values()].filter((s) => !s.state.creds.registered).length
  if (enAttente >= MAX_EN_ATTENTE) throw new Error('SATURE')
  return demarrer(numero, true)
}

export const estConnecte = (numero) => sessions.get(numero)?.connecte === true

export async function restaurerSessions() {
  fs.mkdirSync(DOSSIER, { recursive: true })
  for (const n of fs.readdirSync(DOSSIER)) {
    if (!/^\d{8,15}$/.test(n) || !estLiee(n)) continue
    try {
      await demarrer(n)
    } catch (e) {
      console.log('⚠️ Restauration impossible :', n, '-', e.message)
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
}
