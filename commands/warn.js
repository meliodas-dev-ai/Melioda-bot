import { controleAdmin, cible, trouverMembre, estAdmin, jidDe, numeroDe } from '../lib/groupe.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'warn',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const m = trouverMembre(meta, cible(msg))
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}warn @membre (ou réponds à son message)` })
    if (estAdmin(m)) return sock.sendMessage(jid, { text: "⚠️ Impossible d'avertir un administrateur." })
    const cle = `warns:${jid}`
    const warns = lire(cle, {})
    const num = numeroDe(jidDe(m))
    warns[num] = (warns[num] || 0) + 1
    ecrire(cle, warns)
    let texte = `⚠️ @${num} a reçu un avertissement (${warns[num]}/${config.maxWarns}).`
    if (warns[num] >= config.maxWarns) texte += `\n🚨 Limite atteinte : un admin peut utiliser ${config.prefix}kick.`
    await sock.sendMessage(jid, { text: texte, mentions: [jidDe(m)] })
  },
}
