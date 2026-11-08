import { cadreBienvenue } from './cadreBienvenue.js'
import fs from 'fs'
import { estActif, messageFinal } from './bienvenue.js'
import { moderer } from './moderation.js'
import { modererMots } from './badwords.js'
import { protegerMentions, protegerArrivees } from './protections.js'
import { chargerChaine } from './chaine.js'
import { photo } from './utilisateur.js'
import { numeroDe } from './groupe.js'
import { lire } from './db.js'
import { police } from './police.js'
import { autostyle } from './autostyle.js'
import { envoyerAccueil } from './accueilConnexion.js'

const dernierAccueil = new Map()

function accueil(sock, config) {
  const nom = String(sock.user?.name || 'UTILISATEUR').toUpperCase()
  const prive = lire('mode', {}).prive
  const ligne = (etiquette, valeur) => `┃ ▸ ${police(etiquette.padEnd(8))} : ${valeur}`
  return [
    `┏━━━『 ${police('MELIODAS BOT')} 』━━━┓`,
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
    `┃ ${police('Mode privé : seul toi peux utiliser le bot.')}`,
    `┃ ${police('Tape')} ${config.prefix}${police('public')} ${police('pour ouvrir à tout le monde.')}`,
    '┃',
    `┗━━━━━━━━━━━━━━━━━━━━━┛`,
  ].join('\n')
}

export function brancherEvenements(sock, config) {
  sock.ev.on('connection.update', async ({ connection }) => {
    if (connection !== 'open') return
    await chargerChaine(sock)
    const moi = numeroDe(sock.user?.id || '')
    if (!moi || Date.now() - (dernierAccueil.get(moi) || 0) < 10 * 60 * 1000) return
    dernierAccueil.set(moi, Date.now())
    await new Promise((r) => setTimeout(r, 2000))
    try {
      await envoyerAccueil(sock, moi + '@s.whatsapp.net', config)
    } catch (e) {
      console.log('⚠️ Message d accueil -', e.message)
    }
  })

  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
    await protegerArrivees(sock, id, participants, action).catch(() => {})
    try {
      const type = action === 'add' ? 'welcome' : action === 'remove' ? 'goodbye' : null
      if (!type || !estActif(type, id)) return
      const meta = await sock.groupMetadata(id)
      const ids = participants.map((p) => (typeof p === 'string' ? p : p.phoneNumber || p.id))
      const texte = cadreBienvenue(type, id, ids, meta, config)

      let image = null
      const url = await photo(sock, ids[0])
      if (url) image = { url }
      else {
        try {
          image = fs.readFileSync('assets/channel.jpg')
        } catch {}
      }

      if (image) await sock.sendMessage(id, { image, caption: texte, mentions: ids, sendBrut: true, avecChaine: true })
      else await sock.sendMessage(id, { text: texte, mentions: ids, sendBrut: true, avecChaine: true })
    } catch (e) {
      console.log('⚠️ Erreur événement groupe -', e.message)
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      try {
        await moderer(sock, m)
        await modererMots(sock, m)
        await protegerMentions(sock, m)
        await autostyle(sock, m)
      } catch (e) {
        console.log('⚠️ Erreur modération -', e.message)
      }
    }
  })
}
