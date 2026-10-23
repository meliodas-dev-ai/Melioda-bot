import { estGroupe, expediteurEstAdmin, jidDe, numeroDe } from '../lib/groupe.js'

export default {
  nom: 'tagall',
  run: async ({ sock, jid, msg, args }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    const meta = await sock.groupMetadata(jid)
    if (!expediteurEstAdmin(sock, msg, meta)) {
      return sock.sendMessage(jid, { text: '⛔ Commande réservée aux administrateurs du groupe.' })
    }
    const message = args.join(' ') || 'Attention tout le monde !'
    const texte = `📢 *${message}*\n\n` + meta.participants.map((p) => '@' + numeroDe(jidDe(p))).join('\n')
    await sock.sendMessage(jid, { text: texte, mentions: meta.participants.map(jidDe) })
  },
}
