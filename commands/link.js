import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'link',
  run: async ({ sock, jid, msg }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const code = await sock.groupInviteCode(jid)
    await sock.sendMessage(jid, { text: `🔗 Lien du groupe :\nhttps://chat.whatsapp.com/${code}` })
  },
}
