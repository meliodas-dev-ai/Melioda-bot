import { estProprietaire } from '../lib/acces.js'
import { cible } from '../lib/groupe.js'

export default {
  nom: 'block',
  run: async ({ sock, jid, msg, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const contact = cible(msg)
    if (!contact) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}block @contact (ou réponds à son message)` })
    await sock.updateBlockStatus(contact.split(':')[0].split('@')[0] + '@s.whatsapp.net', 'block')
    await sock.sendMessage(jid, { text: '🚫 Contact bloqué sur ce compte.' })
  },
}
