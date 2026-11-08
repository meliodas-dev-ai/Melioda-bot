import { controleAdmin } from '../lib/groupe.js'
import { lire, ecrire } from '../lib/db.js'
import { CLES_GROUPE } from '../lib/clesGroupe.js'

export default {
  nom: 'restoreconfig',
  run: async ({ sock, jid, msg, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const copie = lire(`backup:${jid}`, null)
    if (!copie) {
      return sock.sendMessage(jid, { text: `⚠️ Aucune sauvegarde. Lance d'abord ${config.prefix}backupconfig` })
    }
    let n = 0
    for (const c of CLES_GROUPE) {
      if (copie[c] !== undefined) {
        ecrire(`${c}:${jid}`, copie[c])
        n++
      }
    }
    await sock.sendMessage(jid, { text: `✅ Paramètres restaurés (${n} réglage(s)).` })
  },
}
