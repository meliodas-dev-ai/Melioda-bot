import { lire } from '../lib/db.js'

export default {
  nom: 'stats',
  run: async ({ sock, jid, commandes }) => {
    const total = new Set([...commandes.values()].map((c) => c.nom)).size
    let groupes = '?'
    try {
      groupes = Object.keys(await sock.groupFetchAllParticipating()).length
    } catch {}
    const s = Math.floor(process.uptime())
    const texte =
      '📊 Statistiques\n\n' +
      `Commandes : ${total}\n` +
      `Groupes : ${groupes}\n` +
      `Utilisateurs bannis : ${lire('bannis', []).length}\n` +
      `En ligne depuis : ${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
    await sock.sendMessage(jid, { text: texte })
  },
}
