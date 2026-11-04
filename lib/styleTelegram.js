import config from '../config.js'
import { police } from './police.js'

const PRESERVER = /(<code>[\s\S]*?<\/code>|<[^>]+>|https?:\/\/\S+|\/[a-z]+|@[A-Za-z0-9_]+)/

function styliser(ligne) {
  return ligne
    .split(PRESERVER)
    .map((m, i) => (i % 2 === 1 ? m : police(m)))
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
