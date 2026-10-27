const entetes = { 'User-Agent': 'MeliodasBot/1.0 (bot WhatsApp)', Accept: 'application/json' }

export default {
  nom: 'wiki',
  run: async ({ sock, jid, args, config }) => {
    const sujet = args.join(' ').trim()
    if (!sujet) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}wiki <sujet>` })
    try {
      const rech = await fetch(
        'https://fr.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&search=' + encodeURIComponent(sujet),
        { headers: entetes, signal: AbortSignal.timeout(10000) }
      )
      const [, titres] = await rech.json()
      if (!titres?.length) return sock.sendMessage(jid, { text: `Aucun résultat pour « ${sujet} ».` })
      const rep = await fetch(
        'https://fr.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(titres[0]),
        { headers: entetes, signal: AbortSignal.timeout(10000) }
      )
      if (!rep.ok) throw new Error('HTTP ' + rep.status)
      const d = await rep.json()
      let extrait = d.extract || 'Pas de résumé disponible.'
      if (extrait.length > 800) extrait = extrait.slice(0, 800).replace(/\s+\S*$/, '') + '…'
      const lien = d.content_urls?.desktop?.page || ''
      await sock.sendMessage(jid, { text: `📚 ${d.title}\n\n${extrait}\n\n${lien}` })
    } catch (e) {
      console.log('⚠️ Erreur wiki -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Recherche impossible pour le moment. Réessaie plus tard.' })
    }
  },
}
