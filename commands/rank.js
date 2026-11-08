import { profil } from '../lib/jeuxRpg.js'

export default {
  nom: 'rank',
  run: async ({ sock, jid, msg }) => {
    const id = msg.key.participant || msg.key.remoteJid
    const p = profil(id)
    await sock.sendMessage(jid, { text: `🏅 Niveau ${p.niveau}\nXP : ${p.xp}/${p.niveau * 100}\nOr : ${p.or}` })
  },
}
