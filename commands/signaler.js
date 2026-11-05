export default {
  nom: 'signaler',
  run: async ({ sock, jid, args }) => {
   if (args.length < 1) {
   await sock.sendMessage(jid, { text: "⚠️ Utilisation:.signaler [numéro]" });
   return;
  }

   const number = args[0].replace(/\s/g, '').replace('+', '');
   const jidToReport = `${number}@s.whatsapp.net`;

   try {
   // On vérifie d'abord si le numéro existe sur WhatsApp
   const exists = await sock.onWhatsApp(number);
   
   if (!exists ||!exists[0].exists) {
   await sock.sendMessage(jid, { text: `❌ Ce numéro (${number}) n'est pas sur WhatsApp.` });
   return;
  }

   // Lancer le processus de signalement réel (antispam/report)
   // Dans la plupart des libs, on utilise le signalement de compte
   await sock.reportContact(jidToReport, 'spam');

   // Attendre un peu pour que WhatsApp traite
   await new Promise(resolve => setTimeout(resolve, 2000));

   // Ici, on renvoie UNIQUEMENT le message système de confirmation de WhatsApp
   await sock.sendMessage(jid, { text: "✅ Merci pour votre signalement." });

   } catch (e) {
   await sock.sendMessage(jid, { text: "❌ Erreur technique lors du signalement." });
   }
  },
}
