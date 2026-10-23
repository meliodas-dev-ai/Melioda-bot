import { estProprietaire, numerosCible } from '../lib/acces.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'unban',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const numeros = await numerosCible(sock, jid, msg, args)
    if (!numeros.length) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}unban @membre (ou réponds à son message, ou ${config.prefix}unban 243812345678)` })
    }
    const bannis = lire('bannis', [])
    if (!numeros.some((n) => bannis.includes(n))) {
      return sock.sendMessage(jid, { text: "⚠️ Cet utilisateur n'est pas banni." })
    }
    ecrire('bannis', bannis.filter((n) => !numeros.includes(n)))
    await sock.sendMessage(jid, { text: '✅ Utilisateur débanni : il peut de nouveau utiliser le bot.' })
  },
}
