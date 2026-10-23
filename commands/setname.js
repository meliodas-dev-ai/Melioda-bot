import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'setname',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!(await controleAdmin(sock, msg, jid))) return
    const nom = args.join(' ')
    if (!nom) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}setname <nouveau nom>` })
    await sock.groupUpdateSubject(jid, nom)
    await sock.sendMessage(jid, { text: `✅ Nom du groupe modifié : ${nom}` })
  },
}
