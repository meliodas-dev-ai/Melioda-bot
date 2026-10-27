import { styles, convertir } from '../lib/stylesTexte.js'

export default {
  nom: 'font',
  run: async ({ sock, jid, args, config }) => {
    const texte = args.join(' ')
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}font <texte>` })
    if (texte.length > 100) return sock.sendMessage(jid, { text: '⚠️ Texte trop long (100 caractères maximum).' })
    const lignes = styles.map((s) => `${s[0]} :\n${convertir(texte, s)}`)
    await sock.sendMessage(jid, { text: `🔤 Styles de police\n\n${lignes.join('\n\n')}` })
  },
}
