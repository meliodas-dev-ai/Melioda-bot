import { cibleOuMoi, photo } from '../lib/utilisateur.js'

export default {
  nom: 'avatar',
  run: async ({ sock, jid, msg }) => {
    const url = await photo(sock, cibleOuMoi(sock, msg))
    if (!url) return sock.sendMessage(jid, { text: '⚠️ Aucune photo de profil accessible.' })
    await sock.sendMessage(jid, { image: { url }, caption: '📸 Photo de profil' })
  },
}
