import { controleAdmin } from './groupe.js'
import { lire, ecrire } from './db.js'

export const reglages = [
  ['welcome', 'Bienvenue'],
  ['goodbye', 'Départ'],
  ['antilien', 'Anti-lien'],
  ['antiflood', 'Anti-flood'],
  ['antispam', 'Anti-spam'],
  ['antibadword', 'Filtre de mots'],
]

export function commandeInterrupteur(cle, libelle) {
  return {
    nom: cle,
    run: async ({ sock, jid, msg, args, config }) => {
      const meta = await controleAdmin(sock, msg, jid)
      if (!meta) return
      const choix = (args[0] || '').toLowerCase()
      if (choix !== 'on' && choix !== 'off') {
        return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}${cle} on/off` })
      }
      const k = `${cle}:${jid}`
      const r = lire(k, {})
      r.actif = choix === 'on'
      ecrire(k, r)
      await sock.sendMessage(jid, { text: `✅ ${libelle} ${choix === 'on' ? 'activé' : 'désactivé'}.` })
    },
  }
}
