import fs from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { chaine } from '../lib/chaine.js'
import { lire } from '../lib/db.js'

const lancer = promisify(execFile)

export default {
  nom: 'status',
  run: async ({ sock, jid }) => {
    let ffmpeg = '❌'
    try {
      await lancer('ffmpeg', ['-version'], { timeout: 5000 })
      ffmpeg = '✅'
    } catch {}
    const texte =
      '🩺 État du bot\n\n' +
      '✅ Connexion WhatsApp\n' +
      `${chaine.jid ? '✅' : '⚠️'} Chaîne officielle\n` +
      `${ffmpeg} Conversion de médias (ffmpeg)\n` +
      `${fs.existsSync('data.json') ? '✅' : '⚠️'} Données enregistrées\n\n` +
      `Mode : ${lire('mode', {}).prive ? 'SELF (privé)' : 'PUBLIC'}\n` +
      `Maintenance : ${lire('maintenance', {}).actif ? 'activée' : 'désactivée'}`
    await sock.sendMessage(jid, { text: texte })
  },
}
