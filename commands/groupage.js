import { estGroupe } from '../lib/groupe.js'

export default {
  nom: 'groupage',
  run: async ({ sock, jid }) => {
    if (!estGroupe(jid)) return sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    const meta = await sock.groupMetadata(jid)
    if (!meta.creation) return sock.sendMessage(jid, { text: "⚠️ Date de création indisponible." })
    const creation = new Date(meta.creation * 1000)
    const jours = Math.floor((Date.now() - creation.getTime()) / 86400000)
    await sock.sendMessage(jid, {
      text: `🏛️ ${meta.subject}\nCréé le : ${creation.toLocaleDateString('fr-FR')}\nÂge : ${jours} jour(s)`,
    })
  },
}
