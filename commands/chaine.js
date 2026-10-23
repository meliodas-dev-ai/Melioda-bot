import { chaine, chargerChaine } from '../lib/chaine.js'

export default {
  nom: 'chaine',
  run: async ({ sock, jid }) => {
    const ok = await chargerChaine(sock)
    await sock.sendMessage(jid, {
      text: ok ? `📢 Chaîne trouvée : ${chaine.nom}` : "⚠️ Chaîne introuvable. Regarde le message d'erreur dans Termux.",
    })
  },
}
