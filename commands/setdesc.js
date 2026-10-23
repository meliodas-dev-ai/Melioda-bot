import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'setdesc',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!(await controleAdmin(sock, msg, jid))) return
    const desc = args.join(' ')
    if (!desc) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}setdesc <nouvelle description>` })
    await sock.groupUpdateDescription(jid, desc)
    await sock.sendMessage(jid, { text: '✅ Description du groupe modifiée.' })
  },
}
