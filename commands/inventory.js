import { profil, objets } from '../lib/jeuxRpg.js'

export default {
  nom: 'inventory',
  run: async ({ sock, jid, msg }) => {
    const id = msg.key.participant || msg.key.remoteJid
    const p = profil(id)
    const liste = Object.entries(p.objets).filter(([, n]) => n > 0)
    if (!liste.length) return sock.sendMessage(jid, { text: `🎒 Inventaire vide\nOr : ${p.or}` })
    const lignes = liste.map(([k, n]) => `• ${objets[k]?.nom || k} × ${n}`).join('\n')
    await sock.sendMessage(jid, { text: `🎒 Inventaire\n\n${lignes}\n\nOr : ${p.or}` })
  },
}
