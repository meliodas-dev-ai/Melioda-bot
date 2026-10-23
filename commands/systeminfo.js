import os from 'os'
import { estProprietaire } from '../lib/acces.js'

const mo = (n) => Math.round(n / 1024 / 1024)

export default {
  nom: 'systeminfo',
  run: async ({ sock, jid, msg }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const texte =
      '🖥️ Système\n\n' +
      `Node.js : ${process.version}\n` +
      `Plateforme : ${os.platform()} ${os.arch()}\n` +
      `CPU : ${os.cpus().length} cœur(s)\n` +
      `RAM : ${mo(os.totalmem() - os.freemem())} / ${mo(os.totalmem())} Mo\n` +
      `Mémoire du bot : ${mo(process.memoryUsage().rss)} Mo`
    await sock.sendMessage(jid, { text: texte })
  },
}
