import os from 'os'

export default {
  nom: 'serverinfo',
  run: async ({ sock, jid }) => {
    const mo = (n) => Math.round(n / 1024 / 1024)
    await sock.sendMessage(jid, {
      text:
        '🖥️ Serveur\n\n' +
        `Node.js : ${process.version}\n` +
        `Système : ${os.platform()} ${os.arch()}\n` +
        `CPU : ${os.cpus().length} cœur(s)\n` +
        `Mémoire du bot : ${mo(process.memoryUsage().rss)} Mo\n` +
        `En ligne depuis : ${Math.floor(process.uptime() / 3600)} h`,
    })
  },
}
