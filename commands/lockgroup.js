import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'lockgroup',
  run: async ({ sock, jid, msg, args, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const min = Number(args[0] || 0)
    if (!Number.isInteger(min) || min < 1 || min > 1440) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}lockgroup <minutes> (1 à 1440)\nExemple : ${config.prefix}lockgroup 30` })
    }
    await sock.groupSettingUpdate(jid, 'announcement')
    await sock.sendMessage(jid, { text: `🔒 Groupe verrouillé pendant ${min} minute(s).` })
    setTimeout(async () => {
      await sock.groupSettingUpdate(jid, 'not_announcement').catch(() => {})
      await sock.sendMessage(jid, { text: '🔓 Le groupe est de nouveau ouvert.' }).catch(() => {})
    }, min * 60 * 1000)
  },
}
