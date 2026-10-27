const codes = {
  0: 'Ciel dégagé ☀️', 1: 'Plutôt dégagé 🌤️', 2: 'Partiellement nuageux ⛅', 3: 'Couvert ☁️',
  45: 'Brouillard 🌫️', 48: 'Brouillard givrant 🌫️', 51: 'Bruine légère 🌦️', 53: 'Bruine 🌦️',
  55: 'Bruine forte 🌧️', 61: 'Pluie légère 🌧️', 63: 'Pluie 🌧️', 65: 'Forte pluie 🌧️',
  71: 'Neige légère 🌨️', 73: 'Neige 🌨️', 75: 'Forte neige ❄️', 80: 'Averses légères 🌦️',
  81: 'Averses 🌧️', 82: 'Fortes averses ⛈️', 95: 'Orage ⛈️', 96: 'Orage avec grêle ⛈️',
  99: 'Orage violent avec grêle ⛈️',
}

export default {
  nom: 'weather',
  run: async ({ sock, jid, args, config }) => {
    const ville = args.join(' ').trim()
    if (!ville) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}weather <ville>` })
    try {
      const geo = await fetch(
        'https://geocoding-api.open-meteo.com/v1/search?count=1&language=fr&format=json&name=' + encodeURIComponent(ville),
        { signal: AbortSignal.timeout(10000) }
      )
      const lieu = (await geo.json()).results?.[0]
      if (!lieu) return sock.sendMessage(jid, { text: `Ville introuvable : « ${ville} ».` })
      const meteo = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lieu.latitude}&longitude=${lieu.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
        { signal: AbortSignal.timeout(10000) }
      )
      const m = (await meteo.json()).current
      if (!m) throw new Error('réponse vide')
      const texte =
        `🌍 ${lieu.name}${lieu.country ? ', ' + lieu.country : ''}\n\n` +
        `${codes[m.weather_code] || 'Conditions variables'}\n` +
        `🌡️ ${m.temperature_2m} °C (ressenti ${m.apparent_temperature} °C)\n` +
        `💧 Humidité : ${m.relative_humidity_2m} %\n` +
        `💨 Vent : ${m.wind_speed_10m} km/h`
      await sock.sendMessage(jid, { text: texte })
    } catch (e) {
      console.log('⚠️ Erreur weather -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Météo indisponible pour le moment. Réessaie plus tard.' })
    }
  },
}
