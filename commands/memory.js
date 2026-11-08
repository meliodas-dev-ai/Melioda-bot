import { lire, ecrire } from '../lib/db.js'
import { estGroupe } from '../lib/groupe.js'

export default {
  nom: 'memory',
  alias: ['souvenirs'],
  run: async ({ sock, jid, msg, args, config }) => {
    const p = config.prefix
    if (estGroupe(jid)) {
      return sock.sendMessage(jid, { text: `🔒 Utilise cette commande en privé pour garder tes souvenirs confidentiels.` })
    }
    const id = msg.key.participant || msg.key.remoteJid
    const cle = `memo:${id}`
    const liste = lire(cle, [])
    const sous = (args[0] || '').toLowerCase()

    if (sous === 'add') {
      const texte = args.slice(1).join(' ').trim()
      if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${p}memory add <texte>` })
      if (texte.length > 200) return sock.sendMessage(jid, { text: '⚠️ Souvenir trop long (200 caractères maximum).' })
      if (liste.length >= 10) return sock.sendMessage(jid, { text: `⚠️ Limite de 10 souvenirs. Efface-les avec ${p}memory clear` })
      ecrire(cle, [...liste, texte])
      return sock.sendMessage(jid, { text: '✅ Souvenir enregistré (visible seulement par toi).' })
    }
    if (sous === 'clear') {
      ecrire(cle, [])
      return sock.sendMessage(jid, { text: '🗑️ Tous tes souvenirs ont été effacés.' })
    }
    if (!liste.length) return sock.sendMessage(jid, { text: `Aucun souvenir. Ajoute-en avec ${p}memory add <texte>` })
    const lignes = liste.map((t, i) => `${i + 1}. ${t}`).join('\n')
    await sock.sendMessage(jid, { text: `🧠 Tes souvenirs\n\n${lignes}\n\n${p}memory clear pour tout effacer` })
  },
}
