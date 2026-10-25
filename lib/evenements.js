import fs from 'fs'
import { estActif, messageFinal } from './bienvenue.js'
import { moderer } from './moderation.js'
import { modererMots } from './badwords.js'
import { chargerChaine } from './chaine.js'
import { photo } from './utilisateur.js'
import { numeroDe } from './groupe.js'

const dernierMenu = new Map()

export function brancherEvenements(sock, config) {
  sock.ev.on('connection.update', async ({ connection }) => {
    if (connection !== 'open') return
    await chargerChaine(sock)
    const moi = numeroDe(sock.user?.id || '')
    if (!moi || Date.now() - (dernierMenu.get(moi) || 0) < 10 * 60 * 1000) return
    dernierMenu.set(moi, Date.now())
    await new Promise((r) => setTimeout(r, 2000))
    try {
      await sock.sendMessage(moi + '@s.whatsapp.net', { text: config.prefix + 'menu' })
    } catch (e) {
      console.log('⚠️ Menu automatique -', e.message)
    }
  })

  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
    try {
      const type = action === 'add' ? 'welcome' : action === 'remove' ? 'goodbye' : null
      if (!type || !estActif(type, id)) return
      const meta = await sock.groupMetadata(id)
      const ids = participants.map((p) => (typeof p === 'string' ? p : p.phoneNumber || p.id))
      const texte = messageFinal(type, id, ids, meta.subject, config)

      let image = null
      const url = await photo(sock, ids[0])
      if (url) image = { url }
      else {
        try {
          image = fs.readFileSync('assets/channel.jpg')
        } catch {}
      }

      if (image) await sock.sendMessage(id, { image, caption: texte, mentions: ids })
      else await sock.sendMessage(id, { text: texte, mentions: ids })
    } catch (e) {
      console.log('⚠️ Erreur événement groupe -', e.message)
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      try {
        await moderer(sock, m)
        await modererMots(sock, m)
      } catch (e) {
        console.log('⚠️ Erreur modération -', e.message)
      }
    }
  })
}
