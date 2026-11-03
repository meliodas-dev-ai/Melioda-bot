import { trouverMedia, telecharger, convertir } from '../lib/media.js'

export default {
  nom: 'tovn',
  run: async ({ sock, jid, msg, config }) => {
    const m = trouverMedia(msg, jid, ['audioMessage', 'videoMessage'])
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : réponds à un audio ou à une vidéo avec ${config.prefix}tovn` })
    if (Number(m.contenu.fileLength || 0) > 20 * 1024 * 1024) {
      return sock.sendMessage(jid, { text: '⚠️ Fichier trop lourd (20 Mo maximum).' })
    }
    try {
      const ogg = await convertir(
        await telecharger(sock, m.source),
        ['-vn', '-c:a', 'libopus', '-b:a', '32k', '-ar', '48000', '-ac', '1'],
        'ogg'
      )
      await sock.sendMessage(jid, { audio: ogg, mimetype: 'audio/ogg; codecs=opus', ptt: true })
    } catch (e) {
      console.log('⚠️ Erreur tovn -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Conversion impossible pour ce fichier.' })
    }
  },
}
