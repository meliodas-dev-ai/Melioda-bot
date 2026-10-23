import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'close',
  run: async ({ sock, jid, msg }) => {
    if (!(await controleAdmin(sock, msg, jid))) return
    await sock.groupSettingUpdate(jid, 'announcement')
    await sock.sendMessage(jid, { text: '🔒 Le groupe est fermé : seuls les admins peuvent écrire.' })
  },
}
