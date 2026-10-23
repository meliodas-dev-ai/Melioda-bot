import { estProprietaire } from '../lib/acces.js'

export default {
  nom: 'logout',
  run: async ({ sock, jid, msg }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    await sock.sendMessage(jid, { text: '👋 Déconnexion du bot et suppression de tes données. Tu pourras te reconnecter quand tu veux.' })
    setTimeout(() => sock.logout().catch(() => {}), 1500)
  },
}
