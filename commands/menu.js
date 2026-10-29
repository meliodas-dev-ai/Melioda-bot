import fs from 'fs'
import { police, policeGras } from '../lib/police.js'
import { lire, ecrire } from '../lib/db.js'
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
    const p = config.prefix

    const tape = String(nom || '').toLowerCase()
    let cle = ''
    if (tape === 'allmenu') cle = 'all'
    else if (tape.endsWith('menu') && tape !== 'menu') cle = tape.slice(0, -4)
    else cle = String(args[0] || '').toLowerCase()
    cle = SYNONYMES[cle] || cle

    if (msg.key.fromMe && msg.pushName && lire('nomProprietaire', null) !== msg.pushName) {
      ecrire('nomProprietaire', msg.pushName)
    }
    const proprietaire = String(lire('nomProprietaire', null) || sock.user?.name || 'UTILISATEUR').toUpperCase()
    const mode = lire('mode', {}).prive ? 'SELF' : 'PUBLIC'

    const ligne = (etiquette, valeur) => `╟─⟢ ${policeGras(etiquette.padEnd(8))}: ${valeur}\n`
    let t = `╔═══〔 𖤐 ${police('MELIODAS')} MD 𖤐 〕═══╗\n║\n`
    t += ligne('USER', policeGras(proprietaire))
    t += ligne('MODE', policeGras(mode))
    t += ligne('PREFIX', p)
    t += ligne('VERSION', policeGras(String(config.version)))
    t += ligne('COMMANDS', policeGras(String(noms.length)))
    t += `║\n╚════════════════════════╝\n\n`

    const liste = (icone, titre, lignes) =>
      `╭━━━⟢〔 ${icone} ${policeGras(titre)} 〕\n┃\n${lignes
        .map((l, i) => `${i === lignes.length - 1 ? '┗' : '┣'}⸙ ${l}`)
        .join('\n')}\n╰━━━━━━━━━━━━━━━━━━━━━━\n\n`

    const bloc = ([icone, titre, noms2]) => {
      const l = present(noms2)
      return l.length ? liste(icone, titre, l.map((n) => p + n)) : ''
    }

    const sous = SOUS.find(([k]) => k === cle)
    if (cle === 'all') {
      for (const c of cats) t += bloc(c)
    } else if (sous) {
      const c = cats.find((x) => x[1] === sous[1])
      t += (c && bloc(c)) || `⚠️ ${policeGras('AUCUNE COMMANDE ICI')}\n\n`
    } else {
      const lignes = []
      for (const n of ['ping', 'pair']) if (noms.includes(n)) lignes.push(p + n)
      for (const [k, titre] of SOUS) {
        const c = cats.find((x) => x[1] === titre)
        if (c && present(c[2]).length) lignes.push(`${p}${k}menu`)
      }
      lignes.push(`${p}allmenu`)
      t += liste('📂', 'MAIN MENU', lignes)
    }

    t += `╔════════════════════════╗\n║\n`
    t += `║  ⸙ ${policeGras('POWERED BY')}\n║  ⟢ ${policeGras('MELIODAS DEV')}\n║\n`
    t += `║ 〔 ${policeGras('LA PUISSANCE SE FORGE')} 〕\n║\n`
    t += `╚═══════⟢ ${policeGras('MD')} ⟣═══════╝`

    let image
    try {
      image = fs.readFileSync('assets/channel.jpg')
    } catch {}
    if (image) await sock.sendMessage(jid, { image, caption: t })
    else await sock.sendMessage(jid, { text: t })
  },
}
