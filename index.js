const filtre = (f) => (...a) => { const t = a.map(String).join(' '); if (/Closing session|Failed to decrypt|Session error|Bad MAC|MessageCounterError|SessionEntry/.test(t)) return; f(...a) }
console.info = filtre(console.info.bind(console))
console.warn = filtre(console.warn.bind(console))
console.error = filtre(console.error.bind(console))
import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import pino from 'pino'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import config from './config.js'
import { brancherEvenements } from './lib/evenements.js'
import { habiller } from './lib/style.js'
import { verifierAcces } from './lib/acces.js'

process.on('unhandledRejection', (e) => console.log('⚠️ Erreur non gérée -', e?.message))
process.on('uncaughtException', (e) => console.log('⚠️ Exception -', e?.message))

const commandes = new Map()
const dossier = path.join(process.cwd(), 'commands')
for (const f of fs.readdirSync(dossier).filter((f) => f.endsWith('.js'))) {
  try {
    const mod = await import(pathToFileURL(path.join(dossier, f)).href)
    const cmd = mod.default
    commandes.set(cmd.nom, cmd)
    for (const a of cmd.alias || []) commandes.set(a, cmd)
  } catch (e) {
    console.log('❌ Commande ignorée :', f, '-', e.message)
  }
}
console.log('📦 Commandes chargées :', [...new Set([...commandes.values()].map((c) => c.nom))].join(', '))

function demander(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl.question(question, (rep) => { rl.close(); resolve(rep.trim()) })
  })
}

async function demarrer() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const { version } = await fetchLatestBaileysVersion()

  let numero = null
  if (!state.creds.registered) {
    numero = (await demander('Ton numéro (ex: 243841466086) : ')).replace(/\D/g, '')
  }

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
  })

  const envoi = sock.sendMessage.bind(sock)
  sock.sendMessage = (j, c, o) => envoi(j, habiller(c), o)

  if (numero) {
    await new Promise((r) => setTimeout(r, 3000))
    const code = await sock.requestPairingCode(numero)
    console.log('Code de jumelage :', code)
  }

  sock.ev.on('creds.update', saveCreds)
  brancherEvenements(sock, config)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') console.log('✅ Bot connecté')
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      if (code !== DisconnectReason.loggedOut) demarrer()
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg?.message) return
    const jid = msg.key.remoteJid
    const texte = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || ''
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
      console.log('▶️ commande :', nom); await sock.sendMessage(jid, { react: { text: '🎃', key: msg.key } }).catch(() => {}); await cmd.run({ sock, msg, jid, args, commandes, config }); console.log('✅ terminé :', nom)
    } catch (e) {
      console.log('⚠️ Erreur dans .' + nom, '-', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Une erreur est survenue avec cette commande.' })
    }
  })
}

demarrer()
