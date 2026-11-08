import { profil, sauver, gagnerXp } from '../lib/jeuxRpg.js'

export default {
  nom: 'rpg',
  run: async ({ sock, jid, msg }) => {
    const id = msg.key.participant || msg.key.remoteJid
    const p = gagnerXp(profil(id), 10)
    sauver(id, p)
    await sock.sendMessage(jid, { text: `⚔️ Aventure\n\n+10 XP gagnés. Niveau ${p.niveau} · XP ${p.xp}/${p.niveau * 100} · Or ${p.or}` })
  },
}
