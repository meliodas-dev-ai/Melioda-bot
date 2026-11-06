export default {
  nom: 'vv',
  run: async ({ sock, jid, msg }) => {
   // 1. On identifie le message de vue unique (image ou vidéo)
   const media = msg.message?.imageMessage || msg.message?.videoMessage;

   // Vérification stricte: si ce n'est pas un média ou pas en vue unique, on arrête.
   if (!media ||!media.viewOnce) {
   return await sock.sendMessage(jid, { text: "❌ Ce message n'est pas une vue unique." });
  }

   // 2. Téléchargement du contenu binaire
   try {
   const buffer = await sock.downloadMediaMessage(media);
   const type = media.imageMessage? 'image': 'video';

   // 3. Renvoi direct en mode média NORMAL (sans option viewOnce)
   await sock.sendMessage(jid, { 
   [type]: buffer 
   }, { quoted: msg });

   } catch (error) {
   await sock.sendMessage(jid, { text: "❌ Erreur lors de la récupération du média." });
   }
  },
}
