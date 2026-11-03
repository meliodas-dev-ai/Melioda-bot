import { trouverMedia, telecharger, convertir } from '../lib/media.js'

export default {
  nom: 'grayscale',
  run: async ({ sock, jid, msg, config }) => {
    const m = trouverMedia(msg, jid, ['imageMessage'])
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : réponds à une image avec ${config.prefix}grayscale` })
    try {
      const image = await convertir(await telecharger(sock, m.source), ['-vf', 'hue=s=0', '-frames:v', '1', '-q:v', '2'], 'jpg')
      await sock.sendMessage(jid, { image, caption: '⚫ Image en noir et blanc' })
    } catch (e) {
      console.log('⚠️ Erreur grayscale -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Impossible de traiter cette image.' })
    }
  },
}
