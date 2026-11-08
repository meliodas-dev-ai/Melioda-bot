const entetes = { 'User-Agent': 'MeliodasBot/1.0 (bot WhatsApp)', Accept: 'application/json' }

export default {
  nom: 'ask',
  run: async ({ sock, jid, args, config }) => {
    const question = args.join(' ').trim()
    if (!question) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}ask <question>\nExemple : ${config.prefix}ask c'est quoi la biologie` })
    }
    if (question.length > 150) return sock.sendMessage(jid, { text: '⚠️ Question trop longue (150 caractères maximum).' })
    try {
      const rech = await fetch(
        'https://fr.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&format=json&srsearch=' + encodeURIComponent(question),
        { headers: entetes, signal: AbortSignal.timeout(10000) }
      )
      const titre = (await rech.json()).query?.search?.[0]?.title
      if (!titre) {
        return sock.sendMessage(jid, {
          text: `🔎 Aucun résultat précis pour « ${question} ».\nEssaie avec d'autres mots : https://fr.wikipedia.org/w/index.php?search=${encodeURIComponent(question)}`,
        })
      }
      const rep = await fetch('https://fr.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(titre), {
        headers: entetes,
        signal: AbortSignal.timeout(10000),
      })
      if (!rep.ok) throw new Error('HTTP ' + rep.status)
      const d = await rep.json()
      let extrait = d.extract || 'Pas de résumé disponible.'
      if (extrait.length > 700) extrait = extrait.slice(0, 700).replace(/\s+\S*$/, '') + '…'
      const lien = d.content_urls?.desktop?.page || ''
      await sock.sendMessage(jid, {
        text: `💡 ${d.title}\n\n${extrait}\n\nSource : Wikipédia (extrait)\n${lien}`,
      })
    } catch (e) {
      console.log('⚠️ Erreur ask -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Recherche impossible pour le moment. Réessaie plus tard.' })
    }
  },
}
