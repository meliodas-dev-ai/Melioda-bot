import { trouverMedia, telecharger, convertir } from '../lib/media.js'

export default {
  nom: 'resize',
  run: async ({ sock, jid, msg, args, config }) => {
    const l = parseInt(args[0], 10)
    const h = args[1] ? parseInt(args[1], 10) : -1
    const valide = (n) => n === -1 || (n >= 16 && n <= 4096)
    if (!l || !valide(l) || !valide(h)) {
      return sock.sendMessage(jid, {
        text: `Utilisation : réponds à une image avec ${config.prefix}resize <largeur> [hauteur]\nExemple : ${config.prefix}resize 800 (garde les proportions)\nTailles acceptées : 16 à 4096`,
      })
    }
    const m = trouverMedia(msg, jid, ['imageMessage'])
    if (!m) return sock.sendMessage(jid, { text: '⚠️ Réponds à une image avec la commande.' })
    try {
      const image = await convertir(
        await telecharger(sock, m.source),
        ['-vf', `scale=${l}:${h}`, '-frames:v', '1', '-q:v', '2'],
        'jpg'
      )
      await sock.sendMessage(jid, { image, caption: `📏 Image redimensionnée (largeur ${l}${h === -1 ? '' : ', hauteur ' + h})` })
    } catch (e) {
      console.log('⚠️ Erreur resize -', e.message)
      await sock.sendMessage(jid, { text: "⚠️ Impossible de redimensionner cette image." })
    }
  },
}
