import { controleAdmin } from '../lib/groupe.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'antilien',
  run: async ({ sock, jid, msg, args, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const choix = (args[0] || '').toLowerCase()
    if (choix !== 'on' && choix !== 'off') {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}antilien on/off` })
    }
    const cle = `antilien:${jid}`
    const r = lire(cle, {})
    r.actif = choix === 'on'
    ecrire(cle, r)
    await sock.sendMessage(jid, { text: `✅ Anti-lien ${choix === 'on' ? 'activé' : 'désactivé'}.` })
  },
}
