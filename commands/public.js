import { estProprietaire } from '../lib/acces.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'public',
  run: async ({ sock, jid, msg }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const r = lire('mode', {})
    if (!r.prive) return sock.sendMessage(jid, { text: '🌍 Le bot est déjà en mode public.' })
    r.prive = false
    ecrire('mode', r)
    await sock.sendMessage(jid, { text: '🌍 Mode public activé : tout le monde peut utiliser les commandes.' })
  },
}
