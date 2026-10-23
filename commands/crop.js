import { trouverMedia, telecharger, convertir } from '../lib/media.js'

export default {
  nom: 'crop',
  run: async ({ sock, jid, msg, config }) => {
    const m = trouverMedia(msg, jid, ['imageMessage'])
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : réponds à une image avec ${config.prefix}crop (recadrage carré centré)` })
    try {
      const image = await convertir(
        await telecharger(sock, m.source),
        ['-vf', 'crop=min(iw\\,ih):min(iw\\,ih)', '-frames:v', '1', '-q:v', '2'],
        'jpg'
      )
      await sock.sendMessage(jid, { image, caption: '✂️ Image recadrée en carré' })
    } catch (e) {
      console.log('⚠️ Erreur crop -', e.message)
      await sock.sendMessage(jid, { text: "⚠️ Impossible de recadrer cette image." })
    }
  },
}
