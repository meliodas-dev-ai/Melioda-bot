export default {
  nom: 'song',
  run: async ({ sock, jid, args, config }) => {
    const titre = args.join(' ').trim()
    if (!titre) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}song <titre ou artiste>\nExemple : ${config.prefix}song Gims` })
    }
    if (titre.length > 100) return sock.sendMessage(jid, { text: '⚠️ Titre trop long (100 caractères maximum).' })
    const q = encodeURIComponent(titre)
    await sock.sendMessage(jid, {
      text:
        `🎵 Recherche : ${titre}\n\n` +
        `▶️ YouTube : https://www.youtube.com/results?search_query=${q}\n` +
        `🎧 Spotify : https://open.spotify.com/search/${q}\n\n` +
        `Écoute la musique sur la plateforme officielle.`,
    })
  },
}
