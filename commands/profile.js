import { cibleOuMoi, infos, photo } from '../lib/utilisateur.js'

export default {
  nom: 'profile',
  run: async ({ sock, jid, msg }) => {
    const id = cibleOuMoi(sock, msg)
    const texte = await infos(sock, jid, id)
    const url = await photo(sock, id)
    if (url) await sock.sendMessage(jid, { image: { url }, caption: texte })
    else await sock.sendMessage(jid, { text: texte })
  },
}
