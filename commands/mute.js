import { controleAdmin, cible, trouverMembre, estAdmin, jidDe, numeroDe } from '../lib/groupe.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'mute',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const m = trouverMembre(meta, cible(msg))
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}mute @membre (ou réponds à son message)` })
    if (estAdmin(m)) return sock.sendMessage(jid, { text: '⚠️ Impossible de rendre muet un administrateur.' })
    const num = numeroDe(jidDe(m))
    const muets = lire(`muets:${jid}`, [])
    if (muets.includes(num)) return sock.sendMessage(jid, { text: '⚠️ Ce membre est déjà muet.' })
    muets.push(num)
    ecrire(`muets:${jid}`, muets)
    await sock.sendMessage(jid, { text: `🔇 @${num} est muet : ses messages seront supprimés.`, mentions: [jidDe(m)] })
  },
}
