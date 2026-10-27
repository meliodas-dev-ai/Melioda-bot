import { estProprietaire } from '../lib/acces.js'
import { estGroupe } from '../lib/groupe.js'

export default {
  nom: 'leave',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    if ((args[0] || '').toLowerCase() !== 'oui') {
      return sock.sendMessage(jid, { text: `⚠️ Ton compte va quitter ce groupe. Pour confirmer, tape ${config.prefix}leave oui` })
    }
    await sock.sendMessage(jid, { text: '👋 Je quitte ce groupe.' })
    setTimeout(() => sock.groupLeave(jid).catch(() => {}), 1500)
  },
}
