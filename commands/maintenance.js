import { estProprietaire } from '../lib/acces.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'maintenance',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const choix = (args[0] || '').toLowerCase()
    if (choix !== 'on' && choix !== 'off') {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}maintenance on/off` })
    }
    const r = lire('maintenance', {})
    r.actif = choix === 'on'
    ecrire('maintenance', r)
    await sock.sendMessage(jid, {
      text: r.actif ? '🛠️ Mode maintenance activé : seul le propriétaire peut utiliser le bot.' : '✅ Mode maintenance désactivé.',
    })
  },
}
