import { estProprietaire } from '../lib/acces.js'
import { lire, ecrire } from '../lib/db.js'
import { styles } from '../lib/stylesTexte.js'

export default {
  nom: 'autostyle',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const actuel = lire('autostyle', { actif: false, index: 0 })
    const choix = (args[0] || '').toLowerCase()
    const liste = styles.map((s, i) => `${i + 1}. ${s[0]}`).join('\n')

    if (choix === 'off') {
      ecrire('autostyle', { ...actuel, actif: false })
      return sock.sendMessage(jid, { text: '✅ Écriture automatique désactivée.' })
    }
    if (choix === 'on' || /^\d+$/.test(choix)) {
      let index = actuel.index ?? 0
      if (/^\d+$/.test(choix)) {
        const n = Number(choix)
        if (n < 1 || n > styles.length) {
          return sock.sendMessage(jid, { text: `⚠️ Choisis un numéro entre 1 et ${styles.length}.` })
        }
        index = n - 1
      }
      ecrire('autostyle', { actif: true, index })
      return sock.sendMessage(jid, { text: `✅ Écriture automatique activée : ${styles[index][0]}.` })
    }
    return sock.sendMessage(jid, {
      text: `Utilisation : ${config.prefix}autostyle on | off | <numéro>\n\nStyles :\n${liste}\n\nÉtat : ${actuel.actif ? 'activée' : 'désactivée'}`,
    })
  },
}
