import { downloadMediaMessage, normalizeMessageContent, getContentType } from '@whiskeysockets/baileys';

export default {
  nom: 'vv',
  run: async ({ sock, jid, msg }) => {
    // 1. On récupère le message cité (ou le message actuel)
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    let targetMessage = quoted ? quoted : msg.message;

    // 2. On déballe le conteneur "Vue unique" (viewOnceMessageV2, etc.)
    const normalizedMessage = normalizeMessageContent(targetMessage);
    if (!normalizedMessage) return;

    // 3. On détecte le type de média
    const messageType = getContentType(normalizedMessage);
    const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage'];

    if (!mediaTypes.includes(messageType)) {
      return await sock.sendMessage(jid, { 
        text: "⚠️ Répondez à une photo, vidéo ou audio à vue unique avec .vv" 
      }, { quoted: msg });
    }

    try {
      // 4. Téléchargement du média (la fonction est importée, pas sur sock)
      const buffer = await downloadMediaMessage(
        { message: normalizedMessage }, // On passe un objet message valide
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      // 5. On renvoie le média en mode NORMAL (sans le "Vue unique")
      const type = messageType.replace('Message', ''); // 'imageMessage' -> 'image'
      await sock.sendMessage(jid, { 
        [type]: buffer 
      }, { quoted: msg });

    } catch (e) {
      console.error("Erreur .vv:", e);
      await sock.sendMessage(jid, { 
        text: "❌ Impossible de traiter le média. Vérifiez qu'il est bien à vue unique." 
      }, { quoted: msg });
    }
  },
}
