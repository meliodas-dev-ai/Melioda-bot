import { estProprietaire, numerosCible } from '../lib/acces.js'
import { numeroDe } from '../lib/groupe.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'ban',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const numeros = await numerosCible(sock, jid, msg, args)
    if (!numeros.length) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}ban @membre (ou réponds à son message, ou ${config.prefix}ban 243812345678)` })
    }
    if (numeros.includes(numeroDe(sock.user?.id || ''))) {
      return sock.sendMessage(jid, { text: '⚠️ Tu ne peux pas te bannir toi-même.' })
    }
    const bannis = lire('bannis', [])
    const nouveaux = numeros.filter((n) => !bannis.includes(n))
    if (!nouveaux.length) return sock.sendMessage(jid, { text: '⚠️ Cet utilisateur est déjà banni.' })
    ecrire('bannis', [...bannis, ...nouveaux])
    await sock.sendMessage(jid, { text: '🚫 Utilisateur banni : il ne peut plus utiliser le bot.' })
  },
}
