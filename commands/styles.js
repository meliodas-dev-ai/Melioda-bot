import { STYLES } from '../lib/styles.js'

const PAR_PAGE = 25

export default {
  nom: 'styles',
  run: async ({ sock, jid, args, config }) => {
    const pages = Math.ceil(STYLES.length / PAR_PAGE)
    const page = Math.max(1, parseInt(args[0], 10) || 1)
    if (page > pages) return sock.sendMessage(jid, { text: `Pages disponibles : 1 à ${pages}.` })
    const debut = (page - 1) * PAR_PAGE
    const lignes = STYLES.slice(debut, debut + PAR_PAGE).map(
      (s, i) => `┃ ${String(debut + i + 1).padStart(2, '0')}. ${s.appliquer('MELIODAS')}`
    )
    const texte = [
      '┏━━━『 MELIODAS BOT 』━━━┓',
      '┃',
      `┃ 🎨 STYLES · page ${page}/${pages}`,
      '┃',
      ...lignes,
      '┃',
      `┃ ${config.prefix}styles ${page < pages ? page + 1 : 1} → page suivante`,
      `┃ ${config.prefix}autostyle <numéro> → activer`,
      '┗━━━━━━━━━━━━━━━━━━━━━┛',
    ].join('\n')
    await sock.sendMessage(jid, { text: texte, sendBrut: true })
  },
}
