import { controleBienvenue } from '../lib/groupe.js'

export default {
  nom: 'hidetag',
  run: async ({ sock, jid, msg, args, config }) => {
    const meta = await controleBienvenue(sock, msg, jid)
    if (!meta) return
    const texte = args.join(' ').trim()
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}hidetag <message>` })
    await sock.sendMessage(jid, { text: texte, mentions: meta.participants.map((p) => p.phoneNumber || p.id) })
  },
}
