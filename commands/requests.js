import { controleBienvenue } from '../lib/groupe.js'

export default {
  nom: 'requests',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleBienvenue(sock, msg, jid)
    if (!meta) return
    try {
      const liste = await sock.groupRequestParticipantsList(jid)
      if (!liste?.length) return sock.sendMessage(jid, { text: '📭 Aucune demande d’adhésion en attente.' })
      const noms = liste.map((p, i) => `${i + 1}. ${String(p.jid || '').split('@')[0]}`).join('\n')
      await sock.sendMessage(jid, { text: `📥 Demandes en attente (${liste.length})\n\n${noms}\n\nTape ${config.prefix}approve pour tout accepter.` })
    } catch (e) {
      await sock.sendMessage(jid, { text: '⚠️ Impossible de lire les demandes. Le groupe doit exiger une approbation.' })
    }
  },
}
