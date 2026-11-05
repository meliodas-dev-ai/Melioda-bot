export default {
  nom: 'vv',
  run: async ({ sock, jid, msg }) => {
   // Vérifie si c'est une vue unique
   const viewOnce = msg.message.imageMessage?.viewOnce || msg.message.videoMessage?.viewOnce;

   if (!viewOnce) {
   await sock.sendMessage(jid, { text: "❌ Ce message n'est pas une 'vue unique'." });
   return;
 }

   const media = msg.message.imageMessage || msg.message.videoMessage;
   const download = await sock.downloadMediaMessage(media);
  
   // Renvoie l'image ou la vidéo normale
   if (msg.message.imageMessage) {
   await sock.sendMessage(jid, { image: download, caption: '' }, { quoted: msg });
   } else {
   await sock.sendMessage(jid, { video: download, caption: '' }, { quoted: msg });
  }
  },
}
