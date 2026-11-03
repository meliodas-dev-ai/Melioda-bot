import { trouverMedia, telecharger, convertir } from '../lib/media.js'

const filtres = { 90: 'transpose=1', 180: 'hflip,vflip', 270: 'transpose=2' }

export default {
  nom: 'rotate',
  run: async ({ sock, jid, msg, args, config }) => {
    const angle = Number(args[0] || 90)
    if (!filtres[angle]) {
      return sock.sendMessage(jid, { text: `Utilisation : réponds à une image avec ${config.prefix}rotate 90, 180 ou 270` })
    }
    const m = trouverMedia(msg, jid, ['imageMessage'])
    if (!m) return sock.sendMessage(jid, { text: '⚠️ Réponds à une image avec la commande.' })
    try {
      const image = await convertir(await telecharger(sock, m.source), ['-vf', filtres[angle], '-frames:v', '1', '-q:v', '2'], 'jpg')
      await sock.sendMessage(jid, { image, caption: `🔄 Image tournée de ${angle}°` })
    } catch (e) {
      console.log('⚠️ Erreur rotate -', e.message)
      await sock.sendMessage(jid, { text: '⚠️ Impossible de tourner cette image.' })
    }
  },
}
