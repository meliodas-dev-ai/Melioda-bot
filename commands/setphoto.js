import { downloadMediaMessage } from '@whiskeysockets/baileys'
import pino from 'pino'
import { estProprietaire } from '../lib/acces.js'

export default {
  nom: 'setphoto',
  run: async ({ sock, jid, msg, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const ctx = msg.message?.extendedTextMessage?.contextInfo
    if (!ctx?.quotedMessage?.imageMessage) {
      return sock.sendMessage(jid, { text: `Utilisation : réponds à une image avec ${config.prefix}setphoto` })
    }
    const faux = {
      key: { remoteJid: jid, id: ctx.stanzaId, participant: ctx.participant },
      message: ctx.quotedMessage,
    }
    const buffer = await downloadMediaMessage(faux, 'buffer', {}, {
      logger: pino({ level: 'silent' }),
      reuploadRequest: sock.updateMediaMessage,
    })
    await sock.updateProfilePicture(sock.user.id, buffer)
    await sock.sendMessage(jid, { text: '✅ Photo de profil du compte modifiée.' })
  },
}
