export default {
  nom: 'jsonformat',
  alias: ['json'],
  run: async ({ sock, jid, args, config }) => {
    const brut = args.join(' ').trim()
    if (!brut) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}jsonformat {"nom":"Meliodas"}` })
    if (brut.length > 1500) return sock.sendMessage(jid, { text: '⚠️ JSON trop long (1500 caractères maximum).' })
    try {
      const propre = JSON.stringify(JSON.parse(brut), null, 2)
      await sock.sendMessage(jid, { text: '```\n' + propre + '\n```', sendBrut: true, avecChaine: true })
    } catch {
      await sock.sendMessage(jid, { text: '⚠️ JSON invalide. Vérifie les guillemets et les virgules.' })
    }
  },
}
