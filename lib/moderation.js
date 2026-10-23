import { estGroupe, estAdmin, trouverMembre, botEstAdmin, numeroDe } from './groupe.js'
import { lire } from './db.js'

const regexLien = /(https?:\/\/|www\.|chat\.whatsapp\.com\/)\S+/i
const FLOOD_MAX = 6
const FLOOD_FENETRE = 10000
const SPAM_MAX = 3
const historique = new Map()
const derniers = new Map()

export async function moderer(sock, msg) {
  if (!msg?.message || msg.key.fromMe) return
  const jid = msg.key.remoteJid
  if (!estGroupe(jid)) return

  const antilien = lire(`antilien:${jid}`, {}).actif
  const antiflood = lire(`antiflood:${jid}`, {}).actif
  const antispam = lire(`antispam:${jid}`, {}).actif
  const muets = lire(`muets:${jid}`, [])
  if (!antilien && !antiflood && !antispam && !muets.length) return

  const texte =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    ''

  const meta = await sock.groupMetadata(jid)
  const auteur = trouverMembre(meta, msg.key.participant)
  if (!auteur || estAdmin(auteur)) return
  if (!botEstAdmin(sock, meta)) return

  const id = auteur.phoneNumber || auteur.id
  const num = numeroDe(id)
  const supprimer = () => sock.sendMessage(jid, { delete: msg.key })
  const avertir = (t) => sock.sendMessage(jid, { text: t, mentions: [id] })

  if (muets.includes(num)) {
    await supprimer()
    return
  }

  if (antilien && regexLien.test(texte)) {
    await supprimer()
    await avertir(`🚫 @${num}, les liens sont interdits dans ce groupe.`)
    return
  }

  const cle = `${jid}:${num}`
  const maintenant = Date.now()

  if (antiflood) {
    const liste = (historique.get(cle) || []).filter((t) => maintenant - t < FLOOD_FENETRE)
    liste.push(maintenant)
    historique.set(cle, liste)
    if (liste.length > FLOOD_MAX) {
      await supprimer()
      if (liste.length === FLOOD_MAX + 1) await avertir(`⚠️ @${num}, ralentis : trop de messages d'affilée.`)
      return
    }
  }

  if (antispam && texte) {
    const d = derniers.get(cle)
    const n = d && d.texte === texte ? d.n + 1 : 1
    derniers.set(cle, { texte, n })
    if (n > SPAM_MAX) {
      await supprimer()
      if (n === SPAM_MAX + 1) await avertir(`⚠️ @${num}, évite de répéter le même message.`)
    }
  }
}
