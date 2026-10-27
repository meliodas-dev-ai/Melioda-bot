import { styles, convertir } from '../lib/stylesTexte.js'

const decors = [
  (t) => `꧁༺ ${t} ༻꧂`,
  (t) => `★彡 ${t} 彡★`,
  (t) => `『 ${t} 』`,
  (t) => `▀▄▀▄ ${t} ▄▀▄▀`,
  (t) => `✦•······•✦ ${t} ✦•······•✦`,
]

export default {
  nom: 'fancy',
  run: async ({ sock, jid, args, config }) => {
    const texte = args.join(' ')
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}fancy <texte>` })
    if (texte.length > 60) return sock.sendMessage(jid, { text: '⚠️ Texte trop long (60 caractères maximum).' })
    const lignes = decors.map((d, i) => d(convertir(texte, styles[i % styles.length])))
    await sock.sendMessage(jid, { text: `✨ Variantes décoratives\n\n${lignes.join('\n\n')}` })
  },
}
