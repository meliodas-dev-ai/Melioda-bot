import { estGroupe } from '../lib/groupe.js'
import { lire } from '../lib/db.js'

export default {
  nom: 'rules',
  run: async ({ sock, jid, config }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    const regles = lire(`regles:${jid}`, null)
    if (!regles) {
      return sock.sendMessage(jid, { text: `Aucune règle définie. Un admin peut en ajouter avec ${config.prefix}setrules` })
    }
    await sock.sendMessage(jid, { text: `📜 Règles du groupe\n\n${regles}` })
  },
}
