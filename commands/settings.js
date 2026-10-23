import { estGroupe } from '../lib/groupe.js'
import { lire } from '../lib/db.js'
import { reglages } from '../lib/reglages.js'

export default {
  nom: 'settings',
  run: async ({ sock, jid }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    const lignes = reglages.map(([cle, nom]) => `${lire(`${cle}:${jid}`, {}).actif ? '✅' : '❌'} ${nom}`)
    await sock.sendMessage(jid, { text: '⚙️ *Réglages du groupe*\n\n' + lignes.join('\n') })
  },
}
