import { estGroupe, estAdmin, trouverMembre, botEstAdmin, numeroDe } from './groupe.js'
import { lire } from './db.js'

export async function modererMots(sock, msg) {
  if (!msg?.message || msg.key.fromMe) return
  const jid = msg.key.remoteJid
  if (!estGroupe(jid)) return
  const r = lire(`antibadword:${jid}`, {})
  if (!r.actif || !r.mots?.length) return

  const texte = (
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    ''
  ).toLowerCase()
  if (!texte) return
  const mots = texte.split(/[^\p{L}\p{N}]+/u)
  if (!r.mots.some((m) => mots.includes(m))) return

  const meta = await sock.groupMetadata(jid)
  const auteur = trouverMembre(meta, msg.key.participant)
  if (!auteur || estAdmin(auteur)) return
  if (!botEstAdmin(sock, meta)) return

  const id = auteur.phoneNumber || auteur.id
  await sock.sendMessage(jid, { delete: msg.key })
  await sock.sendMessage(jid, {
    text: `🚫 @${numeroDe(id)}, merci de surveiller ton langage.`,
    mentions: [id],
  })
}
