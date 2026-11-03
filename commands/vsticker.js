import { trouverMedia, telecharger, convertir } from '../lib/media.js'

const filtres = {
  crop: 'fps=12,scale=512:512:force_original_aspect_ratio=increase,crop=512:512',
  fit: 'fps=12,scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0',
}

export default {
  nom: 'vsticker',
  alias: ['sv'],
  run: async ({ sock, jid, msg, args, config }) => {
    const m = trouverMedia(msg, jid, ['videoMessage'])
    if (!m) {
      return sock.sendMessage(jid, {
        text: `Utilisation : réponds à une vidéo ou à un GIF avec ${config.prefix}vsticker (6 secondes maximum)\nOption : ${config.prefix}vsticker fit (image entière)`,
      })
    }
    if (Number(m.contenu.fileLength || 0) > 15 * 1024 * 1024) {
      return sock.sendMessage(jid, { text: '⚠️ Vidéo trop lourde (15 Mo maximum).' })
    }
    const mode = (args[0] || '').toLowerCase() === 'fit' ? 'fit' : 'crop'
    try {
      const source = await telecharger(sock, m.source)
      let resultat = null
      for (const q of [50, 35, 25]) {
        resultat = await convertir(
          source,
          ['-t', '6', '-vf', filtres[mode], '-c:v', 'libwebp', '-loop', '0', '-q:v', String(q), '-compression_level', '4', '-an'],
          'webp'
        )
        if (resultat.length <= 500 * 1024) break
      }
      if (resultat.length > 500 * 1024) {
        return sock.sendMessage(jid, { text: '⚠️ Le sticker est trop lourd. Essaie avec une vidéo plus courte ou plus simple.' })
      }
      await sock.sendMessage(jid, { sticker: resultat })
    } catch (e) {
      console.log('⚠️ Erreur vsticker -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Impossible de créer le sticker animé.' })
    }
  },
}
