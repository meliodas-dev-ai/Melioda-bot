export default {
  nom: 'time',
  run: async ({ sock, jid, args }) => {
    const ville = args.join(' ').trim()
    if (!ville) {
      return sock.sendMessage(jid, { text: `🕐 ${new Date().toLocaleTimeString('fr-FR')}` })
    }
    try {
      const rep = await fetch(
        'https://geocoding-api.open-meteo.com/v1/search?count=1&language=fr&format=json&name=' + encodeURIComponent(ville),
        { signal: AbortSignal.timeout(10000) }
      )
      const lieu = (await rep.json()).results?.[0]
      if (!lieu?.timezone) return sock.sendMessage(jid, { text: `Ville introuvable : « ${ville} ».` })
      const maintenant = new Date()
      const heure = maintenant.toLocaleTimeString('fr-FR', { timeZone: lieu.timezone })
      const date = maintenant.toLocaleDateString('fr-FR', {
        timeZone: lieu.timezone,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
      await sock.sendMessage(jid, { text: `🕐 ${lieu.name}${lieu.country ? ', ' + lieu.country : ''}\n${heure}\n${date}` })
    } catch (e) {
      console.log('⚠️ Erreur time -', e.message)
      await sock.sendMessage(jid, { text: "⚠️ Impossible d'obtenir l'heure pour le moment." })
    }
  },
}
