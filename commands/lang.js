import { lire, ecrire } from '../lib/db.js'
import { estGroupe, controleBienvenue } from '../lib/groupe.js'

export default {
  nom: 'lang',
  alias: ['langue'],
  run: async ({ sock, jid, msg, args, config }) => {
    if (estGroupe(jid)) {
      const meta = await controleBienvenue(sock, msg, jid)
      if (!meta) return
    }
    const choix = (args[0] || '').toLowerCase()
    if (choix !== 'fr' && choix !== 'en') {
      const actuel = lire(`langue:${jid}`, 'fr')
      return sock.sendMessage(jid, {
        text: `Utilisation : ${config.prefix}lang fr | en\nLangue actuelle : ${actuel === 'en' ? 'English' : 'Français'}`,
      })
    }
    ecrire(`langue:${jid}`, choix)
    await sock.sendMessage(jid, { text: choix === 'en' ? '✅ Language set to English.' : '✅ Langue définie : français.' })
  },
}
