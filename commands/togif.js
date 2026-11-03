import { trouverMedia, telecharger, convertir } from '../lib/media.js'

export default {
  nom: 'togif',
  run: async ({ sock, jid, msg, config }) => {
    const m = trouverMedia(msg, jid, ['videoMessage'])
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : réponds à une vidéo avec ${config.prefix}togif` })
    if (Number(m.contenu.fileLength || 0) > 15 * 1024 * 1024) {
      return sock.sendMessage(jid, { text: '⚠️ Vidéo trop lourde (15 Mo maximum).' })
    }
    try {
      const mp4 = await convertir(
        await telecharger(sock, m.source),
        ['-t', '8', '-an', '-vf', 'scale=480:-2,fps=15', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
        'mp4'
      )
      await sock.sendMessage(jid, { video: mp4, gifPlayback: true })
    } catch (e) {
      console.log('⚠️ Erreur togif -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Conversion impossible pour cette vidéo.' })
    }
  },
}
