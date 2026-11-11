import { cible, numeroDe } from '../lib/groupe.js'

export default {
  nom: 'id',
  run: async ({ sock, jid, msg, args, config }) => {
    const texte = args.join(' ').trim()

    // 1. Un lien de groupe : on renvoie l'identifiant du groupe
    const lien = texte.match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/)
    if (lien) {
      try {
        const info = await sock.groupGetInviteInfo(lien[1])
        return sock.sendMessage(jid, {
          text: `🆔 Groupe : ${info.subject}\nIdentifiant : ${info.id}`,
        })
      } catch {
        return sock.sendMessage(jid, { text: '⚠️ Lien invalide ou expiré.' })
      }
    }

    // 2. Une personne (mention, réponse, ou soi-même)
    const personne = cible(msg)
      || (msg.key.fromMe ? sock.user?.id : msg.key.participant)
      || msg.key.remoteJid
    const alt = msg.key.participantAlt
    let t = `🆔 Identifiant : ${personne}`
    if (alt && alt !== personne) t += `\n📱 Numéro : +${numeroDe(alt)}`
    await sock.sendMessage(jid, { text: t })
  },
}
