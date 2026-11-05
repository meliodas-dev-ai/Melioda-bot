import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'approve',
  run: async ({ sock, jid, msg }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    try {
      const liste = await sock.groupRequestParticipantsList(jid)
      if (!liste?.length) return sock.sendMessage(jid, { text: 'Aucune demande à accepter.' })
      const ids = liste.map((p) => p.jid)
      await sock.groupRequestParticipantsUpdate(jid, ids, 'approve')
      await sock.sendMessage(jid, { text: `✅ ${ids.length} demande(s) acceptée(s).` })
    } catch (e) {
      await sock.sendMessage(jid, { text: '⚠️ Impossible d’accepter les demandes pour le moment.' })
    }
  },
}
