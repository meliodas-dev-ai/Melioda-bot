import { estProprietaire } from '../lib/acces.js'
import { exporter } from '../lib/db.js'

export default {
  nom: 'backup',
  run: async ({ sock, jid, msg }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    if (jid.endsWith('@g.us')) {
      return sock.sendMessage(jid, { text: '⚠️ Utilise cette commande en privé (dans ta discussion avec toi-même), pas dans un groupe.' })
    }
    const donnees = exporter()
    if (!Object.keys(donnees).length) return sock.sendMessage(jid, { text: '⚠️ Aucune donnée à sauvegarder.' })
    const date = new Date().toISOString().slice(0, 10)
    await sock.sendMessage(jid, {
      document: Buffer.from(JSON.stringify(donnees, null, 2)),
      mimetype: 'application/json',
      fileName: `sauvegarde-meliodas-${date}.json`,
      caption: '💾 Sauvegarde de tes données (réglages, avertissements, utilisateurs bannis).',
    })
  },
}
