import fs from 'fs'
import { police } from '../lib/police.js'
import { lire } from '../lib/db.js'
import { categories } from '../lib/categories.js'

export default {
  nom: 'menu',
  alias: ['commands'],
  run: async ({ sock, jid, msg, commandes, config }) => {
    const noms = [...new Set([...commandes.values()].map((c) => c.nom))]
    const connus = new Set(categories.flatMap((c) => c[2]))
    const autres = noms.filter((n) => !connus.has(n)).sort()
    const cats = autres.length ? [...categories, ['✨', 'OTHERS', autres]] : categories
    const utilisateur = police((msg.pushName || 'USER').toUpperCase())
    const mode = lire('mode', {}).prive ? 'SELF' : 'PUBLIC'

    let t = `┏━━━『 ${police('MELIODAS BOT')} 』━━━┓\n┃\n`
    t += `┃ 𖤐 ${police('BLACK FURY SYSTEM')}\n┃\n`
    t += `┃ ▸ ${police('USER')}     : ${utilisateur}\n`
    t += `┃ ▸ ${police('MODE')}     : ${police(mode)}\n`
    t += `┃ ▸ ${police('PREFIX')}  : ${config.prefix}\n`
    t += `┃ ▸ ${police('VERSION')} : ${police(config.version)}\n`
    t += `┃ ▸ ${police('COMMANDS')} : ${police(String(noms.length))}\n`
    t += `┃\n┗━━━━━━━━━━━━━━━━━━━━┛\n\n`

    for (const [icone, titre, liste] of cats) {
      const presentes = liste.filter((n) => noms.includes(n)).sort()
      if (!presentes.length) continue
      t += `╭━━━『 ${icone} ${police(titre)} 』\n┃\n`
      t += presentes.map((n) => `┃ ⌬ ${config.prefix}${n}`).join('\n')
      t += `\n╰━━━━━━━━━━━━━━━━━━╯\n\n`
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
