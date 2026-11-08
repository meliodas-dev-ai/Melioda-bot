import { estProprietaire } from '../lib/acces.js'
import { nombreConnectes } from '../lib/gestionnaire.js'
import { lire } from '../lib/db.js'

export default {
  nom: 'godmode',
  run: async ({ sock, jid, msg, commandes }) => {
    if (!estProprietaire(msg)) return sock.sendMessage(jid, { text: '⛔ Commande réservée au propriétaire du bot.' })
    const total = new Set([...commandes.values()].map((c) => c.nom)).size
    const h = Math.floor(process.uptime() / 3600)
    const m = Math.floor((process.uptime() % 3600) / 60)
    await sock.sendMessage(jid, {
      text:
        '📊 Tableau de bord\n\n' +
        `Commandes : ${total}\n` +
        `Comptes connectés : ${nombreConnectes()}\n` +
        `Utilisateurs bannis : ${lire('bannis', []).length}\n` +
        `Mode : ${lire('mode', {}).prive ? 'privé' : 'public'}\n` +
        `Maintenance : ${lire('maintenance', {}).actif ? 'oui' : 'non'}\n` +
        `En ligne depuis : ${h} h ${m} min`,
    })
  },
}
