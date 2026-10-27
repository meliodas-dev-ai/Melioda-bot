import { trouverMedia, telecharger, convertir } from '../lib/media.js'

export default {
  nom: 'tomp3',
  run: async ({ sock, jid, msg, config }) => {
    const m = trouverMedia(msg, jid, ['videoMessage', 'audioMessage'])
    if (!m) {
      return sock.sendMessage(jid, { text: `Utilisation : réponds à une vidéo ou à un audio avec ${config.prefix}tomp3` })
    }
    if (Number(m.contenu.fileLength || 0) > 25 * 1024 * 1024) {
      return sock.sendMessage(jid, { text: '⚠️ Fichier trop lourd (25 Mo maximum).' })
    }
    try {
      const mp3 = await convertir(await telecharger(sock, m.source), ['-vn', '-c:a', 'libmp3lame', '-q:a', '4'], 'mp3')
      await sock.sendMessage(jid, { audio: mp3, mimetype: 'audio/mpeg' })
    } catch (e) {
      console.log('⚠️ Erreur tomp3 -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Conversion impossible pour ce fichier.' })
    }
  },
}
