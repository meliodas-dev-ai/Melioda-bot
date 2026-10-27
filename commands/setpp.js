import { downloadMediaMessage } from '@whiskeysockets/baileys'
import pino from 'pino'
import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'setpp',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const ctx = msg.message?.extendedTextMessage?.contextInfo
    if (!ctx?.quotedMessage?.imageMessage) {
      return sock.sendMessage(jid, { text: `Utilisation : réponds à une image avec ${config.prefix}setpp` })
    }
    const faux = {
      key: { remoteJid: jid, id: ctx.stanzaId, participant: ctx.participant },
      message: ctx.quotedMessage,
    }
    const buffer = await downloadMediaMessage(faux, 'buffer', {}, {
      logger: pino({ level: 'silent' }),
      reuploadRequest: sock.updateMediaMessage,
    })
    await sock.updateProfilePicture(jid, buffer)
    await sock.sendMessage(jid, { text: '✅ Photo du groupe modifiée.' })
  },
}
