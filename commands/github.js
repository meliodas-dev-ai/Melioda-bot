export default {
  nom: 'github',
  run: async ({ sock, jid, args, config }) => {
    const nom = (args[0] || '').trim()
    if (!/^[A-Za-z0-9-]{1,39}$/.test(nom)) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}github <pseudo>` })
    }
    try {
      const r = await fetch(`https://api.github.com/users/${nom}`, {
        headers: { 'User-Agent': 'MeliodasBot', Accept: 'application/vnd.github+json' },
        signal: AbortSignal.timeout(10000),
      })
      if (r.status === 404) return sock.sendMessage(jid, { text: '⚠️ Profil introuvable.' })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      const d = await r.json()
      await sock.sendMessage(jid, {
        text: `🐙 ${d.login}${d.name ? ' · ' + d.name : ''}\n${d.bio || 'Pas de bio.'}\n\nDépôts publics : ${d.public_repos}\nAbonnés : ${d.followers}\n${d.html_url}`,
      })
    } catch (e) {
      console.log('⚠️ Erreur github -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ GitHub ne répond pas pour le moment.' })
    }
  },
}
