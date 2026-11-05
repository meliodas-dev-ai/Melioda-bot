export default {
  nom: 'vv',
  run: async ({ sock, jid, msg }) => {
   // Vérifie si c'est bien un message de vue unique
   const isViewOnce = msg.message.imageMessage?.viewOnce || msg.message.videoMessage?.viewOnce;

   if (!isViewOnce) {
   await sock.sendMessage(jid, { text: "❌ Ce message n'est pas une 'vue unique'." });
   return;
  }

   // On récupère le média
   const media = msg.message.imageMessage || msg.message.videoMessage;
   const download = await sock.downloadMediaMessage(media);
   
   // On renvoie l'original comme une photo ou vidéo normale
   if (msg.message.imageMessage) {
   await sock.sendMessage(jid, { image: download, caption: '' }, { forceViewOnce: false });
   } else {
   await sock.sendMessage(jid, { video: download, caption: '' }, { forceViewOnce: false });
   }
  },
}
