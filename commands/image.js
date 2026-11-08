export default {
  nom: 'image',
  alias: ['img'],
  run: async ({ sock, jid, args, config }) => {
    const sujet = args.join(' ').trim()
    if (!sujet) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}image <sujet>\nExemple : ${config.prefix}image lion` })
    if (sujet.length > 80) return sock.sendMessage(jid, { text: '⚠️ Sujet trop long (80 caractères maximum).' })
    try {
      const url =
        'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' +
        encodeURIComponent(sujet) +
        '&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json'
      const r = await fetch(url, {
        headers: { 'User-Agent': 'MeliodasBot/1.0 (bot WhatsApp)' },
        signal: AbortSignal.timeout(10000),
      })
      const pages = (await r.json()).query?.pages
      const info = pages ? Object.values(pages)[0]?.imageinfo?.[0] : null
      if (!info) return sock.sendMessage(jid, { text: `🔎 Aucune image trouvée pour « ${sujet} ».` })
      await sock.sendMessage(jid, {
        image: { url: info.thumburl || info.url },
        caption: `🖼️ ${sujet}\nSource : Wikimedia Commons\n${info.descriptionurl}`,
      })
    } catch (e) {
      console.log('⚠️ Erreur image -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Recherche d’images impossible pour le moment.' })
    }
  },
}
