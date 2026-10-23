import { controleAdmin, cible, trouverMembre, estAdmin } from '../lib/groupe.js'

export default {
  nom: 'kick',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const m = trouverMembre(meta, cible(msg))
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}kick @membre (ou réponds à son message)` })
    const moi = trouverMembre(meta, sock.user?.id)
    if (moi && m.id === moi.id) return sock.sendMessage(jid, { text: '⚠️ Je ne peux pas me retirer moi-même.' })
    if (estAdmin(m)) return sock.sendMessage(jid, { text: '⚠️ Impossible de retirer un administrateur. Utilise d\'abord .demote.' })
    await sock.groupParticipantsUpdate(jid, [m.id], 'remove')
    await sock.sendMessage(jid, { text: '✅ Membre retiré du groupe.' })
  },
}
