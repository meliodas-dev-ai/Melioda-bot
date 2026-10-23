import { controleAdmin, cible, trouverMembre, estAdmin } from '../lib/groupe.js'

export default {
  nom: 'demote',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const m = trouverMembre(meta, cible(msg))
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}demote @membre (ou réponds à son message)` })
    if (!estAdmin(m)) return sock.sendMessage(jid, { text: "⚠️ Ce membre n'est pas administrateur." })
    if (m.admin === 'superadmin') return sock.sendMessage(jid, { text: '⚠️ Impossible : c\'est le créateur du groupe.' })
    await sock.groupParticipantsUpdate(jid, [m.id], 'demote')
    await sock.sendMessage(jid, { text: '✅ Statut d\'administrateur retiré.' })
  },
}
