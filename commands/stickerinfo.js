import { trouverMedia } from '../lib/media.js'

export default {
  nom: 'stickerinfo',
  run: async ({ sock, jid, msg, config }) => {
    const m = trouverMedia(msg, jid, ['stickerMessage'])
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : réponds à un sticker avec ${config.prefix}stickerinfo` })
    const s = m.contenu
    const taille = s.fileLength ? Math.round(Number(s.fileLength) / 1024) + ' Ko' : 'inconnue'
    const texte =
      '🎨 Infos du sticker\n\n' +
      `📐 Dimensions : ${s.width || '?'} × ${s.height || '?'}\n` +
      `🎞️ Animé : ${s.isAnimated ? 'oui' : 'non'}\n` +
      `💾 Taille : ${taille}\n` +
      `📄 Format : ${s.mimetype || 'image/webp'}`
    await sock.sendMessage(jid, { text: texte })
  },
}
