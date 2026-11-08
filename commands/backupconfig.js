import { controleAdmin } from '../lib/groupe.js'
import { lire, ecrire } from '../lib/db.js'
import { CLES_GROUPE } from '../lib/clesGroupe.js'

export default {
  nom: 'backupconfig',
  run: async ({ sock, jid, msg }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const copie = {}
    for (const c of CLES_GROUPE) {
      const v = lire(`${c}:${jid}`, null)
      if (v !== null) copie[c] = v
    }
    ecrire(`backup:${jid}`, copie)
    await sock.sendMessage(jid, { text: `💾 Paramètres du groupe sauvegardés (${Object.keys(copie).length} réglage(s)).` })
  },
}
