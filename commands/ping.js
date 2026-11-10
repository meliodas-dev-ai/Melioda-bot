export default {
  nom: 'ping',
  categorie: 'Général',
  desc: 'Vérifier la vitesse du bot',
  run: async ({ sock, jid, msg }) => {
    const start = Date.now();
    // On envoie un message temporaire
    const sent = await sock.sendMessage(jid, { text: 'Test...' }, { quoted: msg });
    const end = Date.now();
    
    // On modifie le message pour afficher la vraie latence
    await sock.sendMessage(jid, { 
      text: `🏓 *Pong !*\n\nVitesse : *${end - start} ms*`, 
      edit: sent.key 
    });
  },
}
