import config from '../config.js'

export default {
  nom: 'chaineinfo',
  run: async ({ sock, jid }) => {
    const code = config.chaine.split('/channel/')[1]
    try {
      const m = await sock.newsletterMetadata('invite', code)
      await sock.sendMessage(jid, {
        text: `📢 ${m.name}\n\n${m.description || 'Pas de description.'}\n\nAbonnés : ${m.subscribers ?? 'non disponible'}\n${config.chaine}`,
      })
    } catch (e) {
      await sock.sendMessage(jid, { text: '⚠️ Informations de la chaîne indisponibles pour le moment.' })
    }
  },
}
