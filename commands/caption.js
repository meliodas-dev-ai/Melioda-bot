import { trouverMedia, telecharger } from '../lib/media.js'

export default {
  nom: 'caption',
  run: async ({ sock, jid, msg, args, config }) => {
    const texte = args.join(' ')
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : réponds à une image avec ${config.prefix}caption <légende>` })
    const m = trouverMedia(msg, jid, ['imageMessage'])
    if (!m) return sock.sendMessage(jid, { text: '⚠️ Réponds à une image avec la commande.' })
    try {
      const image = await telecharger(sock, m.source)
      await sock.sendMessage(jid, { image, caption: texte })
    } catch (e) {
      console.log('⚠️ Erreur caption -', e.message)
      await sock.sendMessage(jid, { text: "⚠️ Impossible d'ajouter la légende." })
    }
  },
}
