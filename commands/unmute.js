import { controleAdmin, cible, trouverMembre, jidDe, numeroDe } from '../lib/groupe.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'unmute',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const m = trouverMembre(meta, cible(msg))
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}unmute @membre (ou réponds à son message)` })
    const num = numeroDe(jidDe(m))
    const muets = lire(`muets:${jid}`, [])
    if (!muets.includes(num)) return sock.sendMessage(jid, { text: "⚠️ Ce membre n'est pas muet." })
    ecrire(`muets:${jid}`, muets.filter((n) => n !== num))
    await sock.sendMessage(jid, { text: `🔊 @${num} peut de nouveau écrire.`, mentions: [jidDe(m)] })
  },
}
