import fs from 'fs'
import config from '../config.js'
import { chaine } from './chaine.js'
import { police, policeItalique } from './police.js'

let miniature
try {
  miniature = fs.readFileSync('assets/channel.jpg')
} catch {}

function contexte() {
  if (chaine.jid) {
    return {
      isForwarded: true,
      forwardingScore: 1,
      forwardedNewsletterMessageInfo: {
        newsletterJid: chaine.jid,
        newsletterName: process.env.NOM_CHAINE || chaine.nom,
        serverMessageId: 143,
      },
    }
  }
  return {
    externalAdReply: {
      title: config.nomBot,
      body: '👉 VOIR LA CHAÎNE',
      sourceUrl: config.chaine,
      mediaType: 1,
      renderLargerThumbnail: false,
      thumbnail: miniature,
      showAdAttribution: false,
    },
  }
}

function styliser(ligne) {
  return ligne
    .split(/(```[^`\n]+```|@\d+|https?:\/\/\S+)/)
    .map((morceau, i) => (i % 2 === 1 ? morceau : police(morceau)))
    .join('')
}

function cadre(texte) {
  const corps = texte.replace(config.signature, '').trim()
  const lignes = corps.split('\n').map((l) => (l.trim() ? `┃ ${styliser(l)}` : '┃'))
  return [
    `┏━━━『 ${policeItalique('MELIODAS MD')} 』━━━┓`,
    '┃',
    '┃',
    ...lignes,
    '┃',
    `┃ 𖤐 ${police('POWERED BY MELIODAS DEV')}`,
    `┗━━━━━━━━━━━━━━━━━━━━━┛`,
  ].join('\n')
}

export function habiller(contenu) {
  if (!contenu || contenu.delete) return contenu
  if (contenu.sendBrut) {
    const { sendBrut, avecChaine, ...propre } = contenu
    if (avecChaine) return { ...propre, contextInfo: { ...(propre.contextInfo || {}), ...contexte() } }
    return propre
  }

  if (contenu.image) {
    const legende =
      typeof contenu.caption === 'string' && !contenu.caption.trimStart().match(/^[┏╔]/)
        ? cadre(contenu.caption)
        : contenu.caption
    return { ...contenu, caption: legende, contextInfo: { ...(contenu.contextInfo || {}), ...contexte() } }
  }

  if (typeof contenu.text !== 'string' || contenu.text.startsWith(config.prefix)) return contenu

  const texte = contenu.text.trimStart().match(/^[┏╔]/) ? contenu.text : cadre(contenu.text)
  return { ...contenu, text: texte, contextInfo: { ...(contenu.contextInfo || {}), ...contexte() } }
}
