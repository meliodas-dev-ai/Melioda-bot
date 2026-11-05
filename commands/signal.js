import { estGroupe, numeroDe } from '../lib/groupe.js'
import { versJid } from '../lib/utilisateur.js'

const derniers = new Map()
const DELAI = 60 * 1000

export default {
  nom: 'signal',
  run: async ({ sock, jid, msg, config }) => {
    const ctx = msg.message?.extendedTextMessage?.contextInfo
    const signale = ctx?.quotedMessage
    if (!signale) {
      return sock.sendMessage(jid, { text: `Utilisation : réponds au message à signaler avec ${config.prefix}signal` })
    }
    const auteur = numeroDe(msg.key.participant || msg.key.remoteJid)
    const maintenant = Date.now()
    if (maintenant - (derniers.get(auteur) || 0) < DELAI) {
      return sock.sendMessage(jid, { text: '⏳ Attends une minute entre deux signalements.' })
    }
    derniers.set(auteur, maintenant)

    let lieu = 'discussion privée'
    if (estGroupe(jid)) {
      try {
        lieu = (await sock.groupMetadata(jid)).subject
      } catch {
        lieu = 'groupe'
      }
    }
    const contenu =
      signale.conversation ||
      signale.extendedTextMessage?.text ||
      signale.imageMessage?.caption ||
      '[média ou message sans texte]'
    const rapport =
      `🚨 Signalement\n\n` +
      `Lieu : ${lieu}\n` +
      `Signalé par : ${auteur}\n` +
      `Auteur du message : ${numeroDe(ctx.participant || '')}\n\n` +
      `Contenu :\n${contenu.slice(0, 800)}`

    await sock.sendMessage(versJid(sock.user.id), { text: rapport })
    await sock.sendMessage(jid, { text: '✅ Signalement envoyé à l’administrateur du bot.' })
  },
}
