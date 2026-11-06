import { lire } from '../lib/db.js'
import { STYLES } from '../lib/styles.js'
import { police, policeGras } from '../lib/police.js'

const PAR_PAGE = 25
const pad = (n) => String(n).padStart(3, '0')

export default {
  nom: 'stymenu',
  run: async ({ sock, jid, args, config }) => {
    const pages = Math.ceil(STYLES.length / PAR_PAGE)
    const page = Math.max(1, parseInt(args[0], 10) || 1)
    if (page > pages) return sock.sendMessage(jid, { text: `Pages disponibles : 1 à ${pages}.` })
    const etat = lire('autostyle', { actif: false, index: 0 })
    const debut = (page - 1) * PAR_PAGE
    const p = config.prefix

    const lignes = STYLES.slice(debut, debut + PAR_PAGE).map((s, i) => {
      const n = debut + i + 1
      const ok = etat.actif && etat.index === n - 1 ? ' ✅' : ''
      return `┣⸙ ${police('Sty')} ${pad(n)} · ${s.appliquer('MELIODAS')}${ok}`
    })

    const texte = [
      `╔═══〔 𖤐 ${police('STYMENU')} 𖤐 〕═══╗`,
      '║',
      `╟─⟢ ${policeGras('ETAT')}  : ${etat.actif ? policeGras('ACTIF') : policeGras('INACTIF')}`,
      `╟─⟢ ${policeGras('STYLE')} : ${policeGras(pad((etat.index ?? 0) + 1))}`,
      `╟─⟢ ${policeGras('PAGE')}  : ${policeGras(page + '/' + pages)}`,
      '║',
      '╚════════════════════════╝',
      '',
      `╭━━━⟢〔 🎨 ${policeGras('STYLES')} 〕`,
      '┃',
      ...lignes,
      '╰━━━━━━━━━━━━━━━━━━━━━━',
      '',
      `${p}${police('sty')} <${police('numéro')}>  →  ${police('activer')}`,
      `${p}${police('sty')} ${police('off')}  →  ${police('désactiver')}`,
      `${p}${police('stymenu')} ${page < pages ? page + 1 : 1}  →  ${police('page suivante')}`,
      '',
      `╔════════════════════════╗`,
      `║  ⸙ ${policeGras('POWERED BY')}`,
      `║  ⟢ ${policeGras('MELIODAS DEV TECH')}`,
      `╚═══════⟢ ${policeGras('MD')} ⟣═══════╝`,
    ].join('\n')

    await sock.sendMessage(jid, { text: texte, sendBrut: true, avecChaine: true })
  },
}
