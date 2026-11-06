import fs from 'fs'
import { lire } from './db.js'
import { police, policeItalique } from './police.js'
import { photo } from './utilisateur.js'

export function texteAccueil(sock, config) {
  const nom = String(sock.user?.name || 'UTILISATEUR').toUpperCase()
  const prive = lire('mode', {}).prive
  const ligne = (etiquette, valeur) => `┃ ▸ ${police(etiquette.padEnd(8))} : ${valeur}`
  return [
    `┏━━━『 ${policeItalique('MELIODAS MD')} 』━━━┓`,
    '┃',
    `┃ ⬡ ${police('NEW CONNECTION')}`,
    '┃',
    ligne('USER', police(nom)),
    ligne('STATUS', police('CONNECTED')),
    ligne('PREFIX', config.prefix),
    ligne('MODE', police(prive ? 'PRIVATE' : 'PUBLIC')),
    ligne('COMMAND', config.prefix + police('menu')),
    '┃',
    `┃ ${police('Bienvenue dans l espace MELIODAS.')}`,
    `┃ ${police('Ton compte est connecté avec succès.')}`,
    '┃',
    `┃ ${police('Tape')} ${config.prefix}${police('menu')} ${police('pour voir les commandes.')}`,
    `┃ ${police('Tape')} ${config.prefix}${police('public')} ${police('pour ouvrir à tout le monde.')}`,
    '┃',
    `┗━━━━━『 ${police('BLACK FURY')} 』━━━━━┛`,
  ].join('\n')
}

export async function envoyerAccueil(sock, jid, config) {
  const texte = texteAccueil(sock, config)
  const moi = sock.user?.id
  let image = null
  const url = moi ? await photo(sock, moi) : null
  if (url) image = { url }
  else {
    try {
      image = fs.readFileSync('assets/channel.jpg')
    } catch {}
  }
  if (image) return sock.sendMessage(jid, { image, caption: texte })
  return sock.sendMessage(jid, { text: texte })
}
