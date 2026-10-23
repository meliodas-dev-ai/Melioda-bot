import { trouverMedia, telecharger, convertir } from '../lib/media.js'

export default {
  nom: 'toimg',
  run: async ({ sock, jid, msg, config }) => {
    const m = trouverMedia(msg, jid, ['stickerMessage'])
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : réponds à un sticker avec ${config.prefix}toimg` })
    try {
      const png = await convertir(await telecharger(sock, m.source), ['-frames:v', '1'], 'png')
      await sock.sendMessage(jid, { image: png, caption: '🖼️ Sticker converti en image' })
    } catch (e) {
      console.log('⚠️ Erreur toimg -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Conversion impossible (les stickers animés ne sont pas pris en charge).' })
    }
  },
}
