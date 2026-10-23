import { estGroupe, estAdmin } from '../lib/groupe.js'

export default {
  nom: 'groupinfo',
  run: async ({ sock, jid }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    const meta = await sock.groupMetadata(jid)
    const admins = meta.participants.filter(estAdmin).length
    const date = meta.creation ? new Date(meta.creation * 1000).toLocaleDateString('fr-FR') : 'inconnue'
    const texte =
      `👥 *${meta.subject}*\n\n` +
      `Membres : ${meta.participants.length}\n` +
      `Administrateurs : ${admins}\n` +
      `Créé le : ${date}\n\n` +
      `📝 ${meta.desc || 'Aucune description.'}`
    await sock.sendMessage(jid, { text: texte })
  },
}
