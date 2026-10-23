import { estProprietaire } from '../lib/acces.js'

export default {
  nom: 'shutdown',
  run: async ({ sock, jid, msg }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    await sock.sendMessage(jid, { text: '🛑 Arrêt du bot. Relance-le avec : bash start.sh' })
    setTimeout(() => process.exit(0), 1500)
  },
}
