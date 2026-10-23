import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'open',
  run: async ({ sock, jid, msg }) => {
    if (!(await controleAdmin(sock, msg, jid))) return
    await sock.groupSettingUpdate(jid, 'not_announcement')
    await sock.sendMessage(jid, { text: '🔓 Le groupe est ouvert : tout le monde peut écrire.' })
  },
}
