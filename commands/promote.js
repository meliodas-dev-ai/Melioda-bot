import { controleAdmin, cible, trouverMembre, estAdmin } from '../lib/groupe.js'

export default {
  nom: 'promote',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const m = trouverMembre(meta, cible(msg))
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}promote @membre (ou réponds à son message)` })
    if (estAdmin(m)) return sock.sendMessage(jid, { text: '⚠️ Ce membre est déjà administrateur.' })
    await sock.groupParticipantsUpdate(jid, [m.id], 'promote')
    await sock.sendMessage(jid, { text: '✅ Membre promu administrateur.' })
  },
}
