import { lire } from './db.js'
import { estGroupe, estAdmin, trouverMembre, botEstAdmin } from './groupe.js'

const arrivees = new Map()
const MAX_MENTIONS = 10
const RAID_MAX = 10
const RAID_FENETRE = 60 * 1000

export async function protegerMentions(sock, msg) {
  if (!msg?.message || msg.key.fromMe) return
  const jid = msg.key.remoteJid
  if (!estGroupe(jid) || !lire(`antitagall:${jid}`, {}).actif) return
  const mentions = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || []
  if (mentions.length < MAX_MENTIONS) return
  const meta = await sock.groupMetadata(jid)
  const auteur = trouverMembre(meta, msg.key.participant)
  if (!auteur || estAdmin(auteur) || !botEstAdmin(sock, meta)) return
  await sock.sendMessage(jid, { delete: msg.key })
  await sock.sendMessage(jid, { text: '🚫 Les mentions massives sont bloquées dans ce groupe.' })
}

export async function protegerArrivees(sock, jid, participants, action) {
  if (action !== 'add' || !lire(`raidguard:${jid}`, {}).actif) return
  const maintenant = Date.now()
  const liste = (arrivees.get(jid) || []).filter((t) => maintenant - t < RAID_FENETRE)
  liste.push(...participants.map(() => maintenant))
  arrivees.set(jid, liste)
  if (liste.length < RAID_MAX) return
  const meta = await sock.groupMetadata(jid)
  if (!botEstAdmin(sock, meta)) return
  await sock.groupSettingUpdate(jid, 'announcement')
  await sock.sendMessage(jid, { text: '🛡️ Arrivées massives détectées : le groupe est verrouillé. Un admin peut le rouvrir avec .open.' })
  arrivees.set(jid, [])
}
