import { profil, sauver, gagnerXp } from '../lib/jeuxRpg.js'

const UN_JOUR = 24 * 60 * 60 * 1000

export default {
  nom: 'daily',
  run: async ({ sock, jid, msg }) => {
    const id = msg.key.participant || msg.key.remoteJid
    const p = profil(id)
    if (Date.now() - p.dernierDaily < UN_JOUR) {
      const reste = Math.ceil((UN_JOUR - (Date.now() - p.dernierDaily)) / 3600000)
      return sock.sendMessage(jid, { text: `⏳ Récompense déjà reçue. Reviens dans environ ${reste} h.` })
    }
    p.or += 50
    p.dernierDaily = Date.now()
    gagnerXp(p, 20)
    sauver(id, p)
    await sock.sendMessage(jid, { text: `🎁 Récompense quotidienne : +50 or, +20 XP.\nOr total : ${p.or}` })
  },
}
