export default {
  nom: 'signaler',
  run: async ({ sock, jid, args }) => {
    if (args.length < 1) {
    await sock.sendMessage(jid, { text: "⚠️ Utilisation:. signaler [numero] (ex:.signal +22784071797)" });
    return;
  }

    const number = args[0].replace(/\D/g, ''); // Enlève tout sauf les chiffres
    const jidToReport = `${number}@s.whatsapp.net`;

   try {
    // Vérification si le contact existe
    const isRegistered = await sock.onWhatsApp(number);
  
    if (!isRegistered[0].exists) {
    // C'est là que la syntaxe n'essayait pas de répondre mais fonctionnait
    await sock.sendMessage(jid, { text: "Ce numero n'est pas sur WhatsApp" });
    return;
  }

    // Exécution principale du signalement
    // Garbage = spam, Group = groupe ou autre motif
    await sock.reportContact(jidToReport, 'Flood');

    // Confirmation visuelle de l'action réussie (Message système standard)
    await sock.sendMessage(jid, { text: "Merci pour votre signalement" });

    } catch (error) {
    // Gestion d'erreur précise pour tailer le message
    await sock.sendMessage(jid, { text: "Erreur lors du signalement" });
   }
  },
}
