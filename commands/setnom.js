import { estProprietaire } from '../lib/acces.js'

export default {
  nom: 'setnom',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const nom = args.join(' ').trim()
    if (!nom) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}setnom <nouveau nom>` })
    if (nom.length > 25) return sock.sendMessage(jid, { text: '⚠️ Nom trop long (25 caractères maximum).' })
    await sock.updateProfileName(nom)
    await sock.sendMessage(jid, { text: `✅ Nom du compte modifié : ${nom}` })
  },
}
