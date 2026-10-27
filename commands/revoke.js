import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'revoke',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    await sock.groupRevokeInvite(jid)
    await sock.sendMessage(jid, { text: `✅ Le lien d'invitation a été réinitialisé. Tape ${config.prefix}link pour obtenir le nouveau.` })
  },
}
