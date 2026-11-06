export default {
  nom: 'vv',
  run: async ({ sock, jid, msg }) => {
   // On récupère n'importe quel type de média attaché
   const media = msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;

   if (!media) {
   await sock.sendMessage(jid, { text: "❌ Erreur: Aucune image ou vidéo trouvée." });
   return;
 }

   try {
   // Téléchargement du média
   const buffer = await sock.downloadMediaMessage(media);
   
   // Renvoi simple: convertit tout en photo ou vidéo normale
   if (media.imageMessage || media.imageMessage?.viewOnce) {
   await sock.sendMessage(jid, { image: buffer }, { quoted: msg });
   } else {
   await sock.sendMessage(jid, { video: buffer }, { quoted: msg });
   }
   } catch (e) {
   await sock.sendMessage(jid, { text: "❌ Impossible de traiter l'image." });
   }
  },
}
