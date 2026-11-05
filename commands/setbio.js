import { estProprietaire } from '../lib/acces.js'

export default {
  nom: 'setbio',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const bio = args.join(' ').trim()
    if (!bio) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}setbio <nouveau statut>` })
    if (bio.length > 139) return sock.sendMessage(jid, { text: '⚠️ Statut trop long (139 caractères maximum).' })
    await sock.updateProfileStatus(bio)
    await sock.sendMessage(jid, { text: '✅ Statut du compte modifié.' })
  },
}
