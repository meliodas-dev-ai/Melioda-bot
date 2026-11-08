import { profil } from '../lib/jeuxRpg.js'

const paliers = [
  [1, '🌱 Débutant'],
  [5, '⚔️ Aventurier'],
  [10, '🛡️ Vétéran'],
  [20, '👑 Légende'],
]

export default {
  nom: 'badge',
  run: async ({ sock, jid, msg }) => {
    const id = msg.key.participant || msg.key.remoteJid
    const p = profil(id)
    const obtenus = paliers.filter(([n]) => p.niveau >= n).map(([, t]) => t)
    const suivant = paliers.find(([n]) => p.niveau < n)
    const suite = suivant ? `Prochain : ${suivant[1]} au niveau ${suivant[0]}` : 'Tous les badges sont obtenus !'
    await sock.sendMessage(jid, { text: `🎖️ Tes badges\n\n${obtenus.join('\n')}\n\n${suite}` })
  },
}
