import { estProprietaire } from '../lib/acces.js'

export default {
  nom: 'restart',
  run: async ({ sock, jid, msg }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    await sock.sendMessage(jid, { text: '🔄 Redémarrage du bot…' })
    setTimeout(() => process.exit(42), 1500)
  },
}
