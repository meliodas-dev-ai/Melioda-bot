export default {
  nom: 'runtime',
  alias: ['uptime'],
  run: async ({ sock, jid }) => {
    const s = Math.floor(process.uptime())
    const j = Math.floor(s / 86400)
    const h = Math.floor((s % 86400) / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    await sock.sendMessage(jid, { text: `⏳ En ligne depuis : ${j}j ${h}h ${m}m ${sec}s` })
  },
}
