import { cibleOuMoi, infos } from '../lib/utilisateur.js'

export default {
  nom: 'userinfo',
  run: async ({ sock, jid, msg }) => {
    await sock.sendMessage(jid, { text: await infos(sock, jid, cibleOuMoi(sock, msg)) })
  },
}
