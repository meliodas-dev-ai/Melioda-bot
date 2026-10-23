import { aide } from '../lib/aide.js'
import { aideBis } from '../lib/aideBis.js'

const descriptions = { ...aide, ...aideBis }

export default {
  nom: 'help',
  run: async ({ sock, jid, args, commandes, config }) => {
    const p = config.prefix
    const nom = (args[0] || '').toLowerCase().replace(p, '')
    if (!nom) {
      return sock.sendMessage(jid, {
        text:
          '📖 Aide\n\n' +
          `• ${p}menu : liste de toutes les commandes\n` +
          `• ${p}help <commande> : explique une commande\n\n` +
          `Exemple : ${p}help sticker`,
      })
    }
    const cmd = commandes.get(nom)
    if (!cmd) return sock.sendMessage(jid, { text: `⚠️ Commande inconnue. Tape ${p}menu pour voir la liste.` })
    let t = `📖 ${p}${cmd.nom}\n\n${descriptions[cmd.nom] || 'Pas de description pour le moment.'}`
    if (cmd.alias?.length) t += `\n\nAlias : ${cmd.alias.map((a) => p + a).join(', ')}`
    await sock.sendMessage(jid, { text: t })
  },
}
