export default {
  nom: 'npm',
  run: async ({ sock, jid, args, config }) => {
    const pkg = (args[0] || '').trim()
    if (!/^(@[a-z0-9-]+\/)?[a-z0-9._-]{1,214}$/i.test(pkg)) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}npm <nom du package>` })
    }
    try {
      const r = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}/latest`, {
        signal: AbortSignal.timeout(10000),
      })
      if (r.status === 404) return sock.sendMessage(jid, { text: '⚠️ Package introuvable.' })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      const d = await r.json()
      await sock.sendMessage(jid, {
        text: `📦 ${d.name} · v${d.version}\n${d.description || 'Pas de description.'}\n\nhttps://www.npmjs.com/package/${d.name}`,
      })
    } catch (e) {
      console.log('⚠️ Erreur npm -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ npm ne répond pas pour le moment.' })
    }
  },
}
