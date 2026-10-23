import { cibleOuMoi } from '../lib/utilisateur.js'

export default {
  nom: 'id',
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: `🆔 ${cibleOuMoi(sock, msg)}` })
  },
}
