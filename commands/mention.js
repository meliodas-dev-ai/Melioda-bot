import { cible, numeroDe } from '../lib/groupe.js'

export default {
  nom: 'mention',
  run: async ({ sock, jid, msg, config }) => {
    const c = cible(msg)
    if (!c) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}mention @membre (ou réponds à son message)` })
    await sock.sendMessage(jid, { text: `👤 @${numeroDe(c)}`, mentions: [c] })
  },
}
