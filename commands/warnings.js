import { estGroupe, cible, trouverMembre, jidDe, numeroDe } from '../lib/groupe.js'
import { lire } from '../lib/db.js'

export default {
  nom: 'warnings',
  run: async ({ sock, jid, msg, config }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    const meta = await sock.groupMetadata(jid)
    const m = trouverMembre(meta, cible(msg))
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}warnings @membre (ou réponds à son message)` })
    const num = numeroDe(jidDe(m))
    const n = lire(`warns:${jid}`, {})[num] || 0
    await sock.sendMessage(jid, { text: `📋 @${num} : ${n}/${config.maxWarns} avertissement(s).`, mentions: [jidDe(m)] })
  },
}
