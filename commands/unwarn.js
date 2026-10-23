import { controleAdmin, cible, trouverMembre, jidDe, numeroDe } from '../lib/groupe.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'unwarn',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const m = trouverMembre(meta, cible(msg))
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}unwarn @membre (ou réponds à son message)` })
    const cle = `warns:${jid}`
    const warns = lire(cle, {})
    const num = numeroDe(jidDe(m))
    if (!warns[num]) return sock.sendMessage(jid, { text: "⚠️ Ce membre n'a aucun avertissement." })
    warns[num] -= 1
    ecrire(cle, warns)
    await sock.sendMessage(jid, {
      text: `✅ Un avertissement retiré à @${num} (${warns[num]}/${config.maxWarns}).`,
      mentions: [jidDe(m)],
    })
  },
}
