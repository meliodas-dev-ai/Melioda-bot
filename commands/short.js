export default {
  nom: 'short',
  run: async ({ sock, jid, args, config }) => {
    const lien = args[0] || ''
    if (!/^https?:\/\/\S+$/i.test(lien)) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}short https://exemple.com/un-long-lien` })
    }
    try {
      const rep = await fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(lien), {
        signal: AbortSignal.timeout(10000),
      })
      const court = (await rep.text()).trim()
      if (!rep.ok || !court.startsWith('http')) throw new Error('réponse invalide')
      await sock.sendMessage(jid, { text: `🔗 ${court}` })
    } catch {
      await sock.sendMessage(jid, { text: '⚠️ Impossible de raccourcir ce lien pour le moment.' })
    }
  },
}
