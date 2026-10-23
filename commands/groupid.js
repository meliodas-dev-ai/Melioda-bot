import { estGroupe } from '../lib/groupe.js'

export default {
  nom: 'groupid',
  run: async ({ sock, jid }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    await sock.sendMessage(jid, { text: `🆔 ${jid}` })
  },
}
