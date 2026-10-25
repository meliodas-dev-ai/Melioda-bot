import fs from 'fs'
import config from '../config.js'
import { chaine } from './chaine.js'
import { police } from './police.js'

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
        newsletterName: chaine.nom,
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
    .split(/(@\d+|https?:\/\/\S+)/)
    .map((morceau, i) => (i % 2 === 1 ? morceau : police(morceau)))
    .join('')
}

function cadre(texte) {
  const corps = texte.replace(config.signature, '').trim()
  const lignes = corps.split('\n').map((l) => (l.trim() ? `┃ ${styliser(l)}` : '┃'))
  return [
    `┏━━━『 ${police(config.nomBot)} 』━━━┓`,
    '┃',
    `┃ 𖤐 ${police('BLACK FURY SYSTEM')}`,
    '┃',
    ...lignes,
    '┃',
    `┃ 𖤐 ${police('POWERED BY MELIODAS DEV')}`,
    `┗━━━━━『 ${police('BLACK FURY')} 』━━━━━┛`,
  ].join('\n')
}

export function habiller(contenu) {
  if (!contenu || contenu.delete) return contenu

  if (contenu.image) {
    const legende =
      typeof contenu.caption === 'string' && !contenu.caption.trimStart().startsWith('┏')
        ? cadre(contenu.caption)
        : contenu.caption
    return { ...contenu, caption: legende, contextInfo: { ...(contenu.contextInfo || {}), ...contexte() } }
  }

  if (typeof contenu.text !== 'string' || contenu.text.startsWith(config.prefix)) return contenu

  const texte = contenu.text.trimStart().startsWith('┏') ? contenu.text : cadre(contenu.text)
  return { ...contenu, text: texte, contextInfo: { ...(contenu.contextInfo || {}), ...contexte() } }
}
