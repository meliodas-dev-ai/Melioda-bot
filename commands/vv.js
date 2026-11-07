export default {
  nom: 'vv',
  run: async ({ sock, jid, msg }) => {
    // 1. On cherche si le message est une réponse (quoted) ou un envoi direct
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    let type, mediaMsg;

    if (quoted) {
      if (quoted.imageMessage) { type = 'image'; mediaMsg = quoted.imageMessage; }
      else if (quoted.videoMessage) { type = 'video'; mediaMsg = quoted.videoMessage; }
    } else {
      if (msg.message?.imageMessage) { type = 'image'; mediaMsg = msg.message.imageMessage; }
      else if (msg.message?.videoMessage) { type = 'video'; mediaMsg = msg.message.videoMessage; }
    }

    // Si on ne trouve aucun média
    if (!mediaMsg) {
      return await sock.sendMessage(jid, { text: "⚠️ Répondez à une image ou une vidéo avec .vv" }, { quoted: msg });
    }

    try {
      // 2. Téléchargement du média (on simule la structure exacte attendue par Baileys)
      const fakeMsg = { message: { [type + 'Message']: mediaMsg } };
      const buffer = await sock.downloadMediaMessage(fakeMsg);

      // 3. Renvoi du média correctement formaté
      await sock.sendMessage(jid, { [type]: buffer }, { quoted: msg });
    } catch (e) {
      console.error("Erreur .vv:", e);
      await sock.sendMessage(jid, { text: "❌ Impossible de traiter le média." }, { quoted: msg });
    }
  },
}
