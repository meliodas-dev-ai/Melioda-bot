import { controleBienvenue } from '../lib/groupe.js'
import { ecrire } from '../lib/db.js'

export default {
  nom: 'setrules',
  run: async ({ sock, jid, msg, args, config }) => {
    const meta = await controleBienvenue(sock, msg, jid)
    if (!meta) return
    const brut = args.join(' ').trim()
    if (!brut) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}setrules Règle 1 | Règle 2 | Règle 3\nLe symbole | sépare les lignes.` })
    }
    if (brut.length > 1000) return sock.sendMessage(jid, { text: '⚠️ Règles trop longues (1000 caractères maximum).' })
    ecrire(`regles:${jid}`, brut.replace(/\s*\|\s*/g, '\n'))
    await sock.sendMessage(jid, { text: `✅ Règles enregistrées. Tape ${config.prefix}rules pour les afficher.` })
  },
}
