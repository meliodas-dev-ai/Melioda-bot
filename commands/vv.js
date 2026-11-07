export default {
  nom: 'vv',
  run: async ({ sock, jid, msg }) => {
    // 1. On regarde si c'est une réponse à un message
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    // On prend le message cité s'il existe, sinon le message actuel
    let messageContent = quoted ? quoted : msg.message;

    if (!messageContent) return;

    // 2. On "ouvre" le dossier Vue Unique (View Once)
    if (messageContent.viewOnceMessageV2) {
      messageContent = messageContent.viewOnceMessageV2.message;
    } else if (messageContent.viewOnceMessage) {
      messageContent = messageContent.viewOnceMessage.message;
    } else if (messageContent.viewOnceMessageV2Extension) {
      messageContent = messageContent.viewOnceMessageV2Extension.message;
    }

    // 3. On cherche l'image ou la vidéo à l'intérieur
    let type, mediaMsg;
    if (messageContent.imageMessage) {
      type = 'image';
      mediaMsg = messageContent.imageMessage;
    } else if (messageContent.videoMessage) {
      type = 'video';
      mediaMsg = messageContent.videoMessage;
    } else if (messageContent.audioMessage) { // Optionnel, pour les vocaux
      type = 'audio';
      mediaMsg = messageContent.audioMessage;
    }

    // Si on ne trouve rien
    if (!mediaMsg) {
      return await sock.sendMessage(jid, { 
        text: "⚠️ Répondez à une photo ou vidéo à vue unique avec .vv" 
      }, { quoted: msg });
    }

    try {
      // 4. On prépare le message pour le téléchargement (Baileys a besoin de cette structure)
      const fakeMsg = { message: messageContent };
      
      // 5. Téléchargement du média en mémoire
      const buffer = await sock.downloadMediaMessage(fakeMsg);

      // 6. On renvoie le média en mode NORMAL (sans le View Once)
      await sock.sendMessage(jid, { 
        [type]: buffer 
      }, { quoted: msg });

    } catch (e) {
      console.error("Erreur .vv:", e);
      await sock.sendMessage(jid, { 
        text: "❌ Impossible de traiter le média." 
      }, { quoted: msg });
    }
  },
}
