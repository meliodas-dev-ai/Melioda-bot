import { estProprietaire } from '../lib/acces.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'private',
  run: async ({ sock, jid, msg }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const r = lire('mode', {})
    if (r.prive) return sock.sendMessage(jid, { text: '🔒 Le bot est déjà en mode privé.' })
    r.prive = true
    ecrire('mode', r)
    await sock.sendMessage(jid, { text: '🔒 Mode privé activé : seul le propriétaire peut utiliser les commandes.' })
  },
}
