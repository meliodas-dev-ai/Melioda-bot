import { estGroupe, estAdmin } from '../lib/groupe.js'

export default {
  nom: 'membres',
  run: async ({ sock, jid }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    const meta = await sock.groupMetadata(jid)
    const admins = meta.participants.filter(estAdmin).length
    await sock.sendMessage(jid, {
      text: `👥 ${meta.subject}\n\nMembres : ${meta.participants.length}\nAdministrateurs : ${admins}\nNon-administrateurs : ${meta.participants.length - admins}`,
    })
  },
}
