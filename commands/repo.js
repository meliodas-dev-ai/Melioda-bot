export default {
  nom: 'repo',
  run: async ({ sock, jid, args, config }) => {
    const m = (args[0] || '').match(/^([A-Za-z0-9-]{1,39})\/([A-Za-z0-9._-]{1,100})$/)
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}repo <utilisateur/depot>\nExemple : ${config.prefix}repo nodejs/node` })
    try {
      const r = await fetch(`https://api.github.com/repos/${m[1]}/${m[2]}`, {
        headers: { 'User-Agent': 'MeliodasBot', Accept: 'application/vnd.github+json' },
        signal: AbortSignal.timeout(10000),
      })
      if (r.status === 404) return sock.sendMessage(jid, { text: '⚠️ Dépôt introuvable ou privé.' })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      const d = await r.json()
      await sock.sendMessage(jid, {
        text: `📁 ${d.full_name}\n${d.description || 'Pas de description.'}\n\n⭐ ${d.stargazers_count} · 🍴 ${d.forks_count} · Langage : ${d.language || 'n/a'}\n${d.html_url}`,
      })
    } catch (e) {
      console.log('⚠️ Erreur repo -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ GitHub ne répond pas pour le moment.' })
    }
  },
}
