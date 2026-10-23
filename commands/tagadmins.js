import { estGroupe, estAdmin, jidDe, numeroDe } from '../lib/groupe.js'

export default {
  nom: 'tagadmins',
  run: async ({ sock, jid, args }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    const meta = await sock.groupMetadata(jid)
    const liste = meta.participants.filter(estAdmin)
    const message = args.join(' ') || "Appel aux administrateurs !"
    const texte = `📢 *${message}*\n\n` + liste.map((p) => '@' + numeroDe(jidDe(p))).join('\n')
    await sock.sendMessage(jid, { text: texte, mentions: liste.map(jidDe) })
  },
}
