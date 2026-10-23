import fs from 'fs'
import { estActif, messageFinal } from './bienvenue.js'
import { moderer } from './moderation.js'
import { modererMots } from './badwords.js'
import { chargerChaine } from './chaine.js'
import { photo } from './utilisateur.js'

export function brancherEvenements(sock, config) {
  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') chargerChaine(sock)
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
