export default {
  nom: 'signaler',
  run: async ({ sock, jid, args, m }) => {
    if (args.length < 2) {
    await sock.sendMessage(jid, { text: '⚠️ Format incorrect.\nUtilisation:.signaler [numéro] [nombre] (ex:.signaler +22784071797 50)' });
    return;
  }

    const phoneNumber = args[0];
    const count = parseInt(args[1]);

    // Validation du nombre de signalements
    if (isNaN(count) || count < 5 || count > 50) {
    await sock.sendMessage(jid, { text: '❌ Le nombre de signalements doit être compris entre 5 et 50.' });
    return;
  }

    // Préparation du contenu du message
    const contentMessage = `📩 Notification de signalisation envoyée par MonBot (x${count}).\nMerci.`;

    await sock.sendMessage(jid, { text: `📡 Envoi de ${count} messages vers ${phoneNumber} en cours...` });

   try {
    // Boucle pour envoyer tous les signalements
    for (let i = 0; i < count; i++) {
    await sock.sendMessage(phoneNumber, { text: contentMessage });
    // Petit délai pour ne pas spammer trop vite (optionnel selon la librairie)
    await new Promise(resolve => setTimeout(resolve, 500));
   }
    await sock.sendMessage(jid, { text: `✅ ${count} signalements envoyés avec succès à ${phoneNumber}.` });
    } catch (error) {
    // Détection d'erreur WhatsApp (nombre invalide ou hors WhatsApp)
    await sock.sendMessage(jid, { text: `❌ Erreur: Ce numéro (${phoneNumber}) ne semble pas être sur WhatsApp. Vérifie le format.` });
   }
  },
}
