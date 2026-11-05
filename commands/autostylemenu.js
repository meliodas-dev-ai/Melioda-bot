import { lire } from '../lib/db.js'
import { STYLES } from '../lib/styles.js'
import { police, policeGras } from '../lib/police.js'

const PAR_PAGE = 25

export default {
  nom: 'autostylemenu',
  alias: ['autostyle', 'stymenu', 'styles2'],
  run: async ({ sock, jid, args, config }) => {
    const pages = Math.ceil(STYLES.length / PAR_PAGE)
    const page = Math.max(1, parseInt(args[0], 10) || 1)
    if (page > pages) return sock.sendMessage(jid, { text: `Pages disponibles : 1 à ${pages}.` })
    const etat = lire('autostyle', { actif: false, index: 0 })
    const debut = (page - 1) * PAR_PAGE
    const p = config.prefix

    const lignes = STYLES.slice(debut, debut + PAR_PAGE).map((s, i) => {
      const n = debut + i + 1
      const marque = etat.actif && etat.index === n - 1 ? ' ✅' : ''
      return `┣⸙ ${String(n).padStart(3, '0')} · ${s.appliquer('MELIODAS')}${marque}`
    })

    const texte = [
      '╔═══〔 𖤐 ' + police('AUTO STYLE') + ' 𖤐 〕═══╗',
      '║',
      `╟─⟢ ${policeGras('ETAT')}   : ${etat.actif ? policeGras('ACTIF') : policeGras('INACTIF')}`,
      `╟─⟢ ${policeGras('STYLE')}  : ${policeGras(String((etat.index ?? 0) + 1))}`,
      `╟─⟢ ${policeGras('PAGE')}   : ${policeGras(page + '/' + pages)}`,
      '║',
      '╚════════════════════════╝',
      '',
      `╭━━━⟢〔 🎨 ${policeGras('STYLES')} 〕`,
      '┃',
      ...lignes,
      '╰━━━━━━━━━━━━━━━━━━━━━━',
      '',
      `${p}autostyle <numéro>  → activer ce style`,
      `${p}autostyle off       → désactiver`,
      `${p}autostylemenu ${page < pages ? page + 1 : 1}  → page suivante`,
    ].join('\n')
    await sock.sendMessage(jid, { text: texte, sendBrut: true })
  },
}
