import { estProprietaire } from '../lib/acces.js'
import { lire, ecrire } from '../lib/db.js'
import { STYLES } from '../lib/styles.js'

const pad = (n) => String(n).padStart(3, '0')

export default {
  nom: 'sty',
  run: async ({ sock, jid, msg, args, config }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const choix = (args[0] || '').toLowerCase()
    const p = config.prefix
    const actuel = lire('autostyle', { actif: false, index: 0 })

    if (choix === 'off') {
      ecrire('autostyle', { ...actuel, actif: false })
      return sock.sendMessage(jid, { text: '✅ Écriture automatique désactivée.' })
    }
    if (/^\d+$/.test(choix)) {
      const n = Number(choix)
      if (n < 1 || n > STYLES.length) return sock.sendMessage(jid, { text: `⚠️ Choisis un numéro entre 1 et ${STYLES.length}.` })
      ecrire('autostyle', { actif: true, index: n - 1 })
      return sock.sendMessage(jid, { text: `✅ Style ${pad(n)} activé : ${STYLES[n - 1].nom}` })
    }
    return sock.sendMessage(jid, { text: `Utilisation : ${p}sty <numéro> ou ${p}sty off\nVoir les styles : ${p}stymenu` })
  },
}
