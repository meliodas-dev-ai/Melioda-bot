import { profil, sauver, gagnerXp } from '../lib/jeuxRpg.js'

export default {
  nom: 'boss',
  run: async ({ sock, jid, msg }) => {
    const id = msg.key.participant || msg.key.remoteJid
    const p = profil(id)
    const force = Math.floor(Math.random() * 20) + p.niveau * 3
    const boss = Math.floor(Math.random() * 25) + 10
    if (force >= boss) {
      p.or += 20
      gagnerXp(p, 30)
      sauver(id, p)
      await sock.sendMessage(jid, { text: `⚔️ Victoire contre le boss !\n+20 or, +30 XP. Niveau ${p.niveau}.` })
    } else {
      sauver(id, p)
      await sock.sendMessage(jid, { text: '💀 Le boss est trop fort cette fois. Réessaie plus tard.' })
    }
  },
}
