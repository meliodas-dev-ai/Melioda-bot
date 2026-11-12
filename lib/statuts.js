import { lire } from './db.js'

const EMOJIS = ['❤️']
const MAX_PAR_HEURE = 60
let compteur = { heure: 0, n: 0 }

const pause = (ms) => new Promise((r) => setTimeout(r, ms))

export async function reagirStatut(sock, msg) {
  if (msg.key?.remoteJid !== 'status@broadcast' || msg.key.fromMe || !msg.message) return
  if (!lire('atl', { actif: false }).actif) return

  const auteur = msg.key.participant || msg.participant
  if (!auteur) {
    console.log('⚠️ Statut sans auteur, réaction annulée')
    return
  }

  const heure = Math.floor(Date.now() / 3600000)
  if (compteur.heure !== heure) compteur = { heure, n: 0 }
  if (compteur.n >= MAX_PAR_HEURE) return
  compteur.n++

  await pause(2000 + Math.random() * 6000)
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
  try {
    await sock.sendMessage(
      'status@broadcast',
      { react: { key: msg.key, text: emoji } },
      { statusJidList: [auteur] }
    )
    console.log('👍 Statut réagi :', emoji, auteur)
  } catch (e) {
    console.log('⚠️ Réaction statut -', e.message)
  }
}
