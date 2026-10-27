import fs from 'fs'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import pino from 'pino'

export default {
  nom: 'setbanner',
  run: async ({ sock, jid, msg, config }) => {
    if (!msg.key.fromMe) {
      return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    }
    const ctx = msg.message?.extendedTextMessage?.contextInfo
    if (!ctx?.quotedMessage?.imageMessage) {
      return sock.sendMessage(jid, { text: `Utilisation : réponds à une image avec ${config.prefix}setbanner` })
    }
    const faux = {
      key: { remoteJid: jid, id: ctx.stanzaId, participant: ctx.participant },
      message: ctx.quotedMessage,
    }
    const buffer = await downloadMediaMessage(faux, 'buffer', {}, {
      logger: pino({ level: 'silent' }),
      reuploadRequest: sock.updateMediaMessage,
    })
    fs.mkdirSync('assets', { recursive: true })
    fs.writeFileSync('assets/channel.jpg', buffer)
    await sock.sendMessage(jid, { text: "✅ Bannière enregistrée. Redémarre le bot (CTRL + C puis bash start.sh) pour l'appliquer." })
  },
}
