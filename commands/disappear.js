import { controleAdmin } from '../lib/groupe.js'

const durees = { off: 0, '24h': 86400, '7j': 604800, '90j': 7776000 }

export default {
  nom: 'disappear',
  run: async ({ sock, jid, msg, args, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const choix = (args[0] || '').toLowerCase()
    if (!(choix in durees)) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}disappear off | 24h | 7j | 90j` })
    }
    await sock.groupToggleEphemeral(jid, durees[choix])
    await sock.sendMessage(jid, { text: choix === 'off' ? '✅ Messages éphémères désactivés.' : `✅ Messages éphémères : ${choix}.` })
  },
}
