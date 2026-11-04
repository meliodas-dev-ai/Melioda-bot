export default {
  nom: 'vv',
  run: async ({ sock, jid, msg }) => {
    // Récupère la photo ou la vidéo du message
    const media = msg.message.imageMessage || msg.message.videoMessage;

    if (!media) {
    await sock.sendMessage(jid, { text: "❌ Veuillez m'envoyer une photo ou une vidéo en répondant à cette commande." });
    return;
  }

    // Télécharge et renvoie le contenu sans texte
    // Pour avoir un format "message standard" (non forwardé), on envoie un nouveau message
    const type = msg.message.imageMessage? 'image': 'video';
    const bufferedContent = await downloadMediaMessage(media);
  
    await sock.sendMessage(jid, { 
    [type]: bufferedContent, 
    caption: '' // Caption vide = contenu nu
    }, { quoted: false });
  },
}
