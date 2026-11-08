import { downloadMediaMessage, normalizeMessageContent, getContentType } from '@whiskeysockets/baileys';

export default {
  nom: 'vv',
  categorie: 'Media',
  desc: 'Débloquer une photo/vidéo à vue unique',
  run: async ({ sock, jid, msg }) => {
    // 1. On récupère le message cité (la réponse) ou le message actuel
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const targetMessage = quoted ? quoted : msg.message;

    if (!targetMessage) return;

    // 2. On déballe le conteneur "Vue unique" (V2 ou normal)
    const normalizedMessage = normalizeMessageContent(targetMessage);
    if (!normalizedMessage) return;

    // 3. On vérifie le type de média
    const messageType = getContentType(normalizedMessage);
    const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage'];

    if (!mediaTypes.includes(messageType)) {
      return await sock.sendMessage(jid, { text: "⚠️ Répondez à une photo, vidéo ou audio à vue unique avec .vv" }, { quoted: msg });
    }

    try {
      // 4. On reconstruit un objet WAMessage complet (INDISPENSABLE pour trouver la mediaKey)
      const fakeWAMessage = {
        key: {
          remoteJid: msg.key.remoteJid,
          id: msg.message?.extendedTextMessage?.contextInfo?.stanzaId || msg.key.id,
          participant: msg.message?.extendedTextMessage?.contextInfo?.participant || msg.key.participant || msg.key.remoteJid
        },
        message: normalizedMessage 
      };

      // 5. Téléchargement du média
      const buffer = await downloadMediaMessage(
        fakeWAMessage,
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      // 6. On renvoie le média en mode NORMAL (sans le "Vue unique")
      const type = messageType.replace('Message', ''); // ex: imageMessage -> image
      await sock.sendMessage(jid, { [type]: buffer }, { quoted: msg });

    } catch (e) {
      console.error("Erreur .vv:", e);
      await sock.sendMessage(jid, { text: "❌ Impossible de traiter le média (déjà vu ou expiré)." }, { quoted: msg });
    }
  },
}
