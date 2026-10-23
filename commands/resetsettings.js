import { controleAdmin } from '../lib/groupe.js'
import { ecrire } from '../lib/db.js'
import { reglages } from '../lib/reglages.js'

export default {
  nom: 'resetsettings',
  run: async ({ sock, jid, msg }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    for (const [cle] of reglages) ecrire(`${cle}:${jid}`, {})
    await sock.sendMessage(jid, { text: '♻️ Réglages du groupe réinitialisés.' })
  },
}
