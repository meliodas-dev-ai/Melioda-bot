import config from '../config.js'
import { police } from './police.js'

const PRESERVER = /(<code>[\s\S]*?<\/code>|<[^>]+>|https?:\/\/\S+|\/[a-z]+)/

function styliser(ligne) {
  return ligne
    .split(PRESERVER)
    .map((morceau, i) => (i % 2 === 1 ? morceau : police(morceau)))
    .join('')
}

export function habiller(texte) {
  const lignes = texte.split('\n').map((l) => (l.trim() ? `┃ ${styliser(l)}` : '┃'))
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
