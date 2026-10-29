import fs from 'fs'
import { police } from '../lib/police.js'
import { lire } from '../lib/db.js'
import { categories } from '../lib/categories.js'

const SOUS = [
  ['group', 'GROUP MENU'],
  ['user', 'USER MENU'],
  ['tools', 'TOOLS'],
  ['search', 'SEARCH'],
  ['game', 'FUN & GAMES'],
  ['text', 'TEXT TOOLS'],
  ['date', 'TIME & DATE'],
  ['media', 'STICKERS'],
  ['info', 'BOT INFO'],
  ['owner', 'ADMIN TOOLS'],
]
const SYNONYMES = {
  groups: 'group', games: 'game', fun: 'game', time: 'date', sticker: 'media', stickers: 'media',
  admin: 'owner', bot: 'info', users: 'user',
}

export default {
  nom: 'menu',
  alias: ['commands', 'groupmenu', 'usermenu', 'toolsmenu', 'searchmenu', 'gamemenu', 'textmenu', 'datemenu', 'mediamenu', 'infomenu', 'ownermenu', 'allmenu'],
  run: async ({ sock, jid, msg, commandes, config, args, nom }) => {
    const noms = [...new Set([...commandes.values()].map((c) => c.nom))]
    const connus = new Set(categories.flatMap((c) => c[2]))
    const autres = noms.filter((n) => !connus.has(n)).sort()
    const cats = autres.length ? [...categories, ['✨', 'OTHERS', autres]] : categories
    const present = (liste) => liste.filter((n) => noms.includes(n)).sort()

    const tape = String(nom || '').toLowerCase()
    let cle = ''
    if (tape === 'allmenu') cle = 'all'
    else if (tape.endsWith('menu') && tape !== 'menu') cle = tape.slice(0, -4)
    else cle = String(args[0] || '').toLowerCase()
    cle = SYNONYMES[cle] || cle

    const utilisateur = police((msg.pushName || 'USER').toUpperCase())
    const mode = lire('mode', {}).prive ? 'SELF' : 'PUBLIC'
    const p = config.prefix

    let t = `┏━━━『 ${police('MELIODAS BOT')} 』━━━┓\n┃\n`
    t += `┃ 𖤐 ${police('BLACK FURY SYSTEM')}\n┃\n`
    t += `┃ ▸ ${police('USER')}     : ${utilisateur}\n`
    t += `┃ ▸ ${police('MODE')}     : ${police(mode)}\n`
    t += `┃ ▸ ${police('PREFIX')}  : ${p}\n`
    t += `┃ ▸ ${police('VERSION')} : ${police(config.version)}\n`
    t += `┃ ▸ ${police('COMMANDS')} : ${police(String(noms.length))}\n`
    t += `┃\n┗━━━━━━━━━━━━━━━━━━━━┛\n\n`

    const bloc = ([icone, titre, liste]) => {
      const l = present(liste)
      if (!l.length) return ''
      return `╭━━━『 ${icone} ${police(titre)} 』\n┃\n${l.map((n) => `┃ ⌬ ${p}${n}`).join('\n')}\n╰━━━━━━━━━━━━━━━━━━╯\n\n`
    }

    const sous = SOUS.find(([k]) => k === cle)
    if (cle === 'all') {
      for (const c of cats) t += bloc(c)
    } else if (sous) {
      const c = cats.find((x) => x[1] === sous[1])
      t += c && bloc(c) ? bloc(c) : `⚠️ ${police('AUCUNE COMMANDE ICI')}\n\n`
    } else {
      const lignes = []
      for (const n of ['ping', 'pair']) if (noms.includes(n)) lignes.push(`┃ ⌬ ${p}${n}`)
      for (const [k, titre] of SOUS) {
        const c = cats.find((x) => x[1] === titre)
        if (c && present(c[2]).length) lignes.push(`┃ ⌬ ${p}${k}menu`)
      }
      lignes.push(`┃ ⌬ ${p}allmenu`)
      t += `╭━━━『 📂 ${police('MAIN MENU')} 』\n┃\n${lignes.join('\n')}\n╰━━━━━━━━━━━━━━━━━━╯\n\n`
    }

    t += `┏━━━━━━━━━━━━━━━━━━━━┓\n┃\n┃ 𖤐 ${police('POWERED BY')}\n┃      ${police('MELIODAS DEV')}\n┃\n`
    t += `┃ 〘 ${police('LA PUISSANCE SE FORGE')} 〙\n┃\n┗━━━━━『 ${police('BLACK FURY')} 』━━━━━┛`

    let image
    try {
      image = fs.readFileSync('assets/channel.jpg')
    } catch {}
    if (image) await sock.sendMessage(jid, { image, caption: t })
    else await sock.sendMessage(jid, { text: t })
  },
}
