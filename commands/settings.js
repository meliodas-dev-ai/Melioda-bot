import { estGroupe } from '../lib/groupe.js'
import { lire } from '../lib/db.js'
import { reglages } from '../lib/reglages.js'

const PAR_DEFAUT = new Set(['welcome', 'goodbye'])

export default {
  nom: 'settings',
  run: async ({ sock, jid }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    const actif = (cle) => {
      const v = lire(`${cle}:${jid}`, {}).actif
      return v === undefined ? PAR_DEFAUT.has(cle) : v
    }
    const lignes = reglages.map(([cle, nom]) => `${actif(cle) ? '✅' : '❌'} ${nom}`)
    await sock.sendMessage(jid, { text: '⚙️ *Réglages du groupe*\n\n' + lignes.join('\n') })
  },
}
