export default {
  nom: 'signal',
  run: async ({ sock, jid, args }) => {
    if (!args[0]) {
    await sock.sendMessage(jid, { text: "⚠️ Utilisation:.signal [numero/taille]\n\nExemple:.signal 243972676769/50 (pour 50 signalements)." });
    return;
 }

    // 1. On sépare le numéro et la taille/taille
    const parts = args[0].split('/');
    const number = parts[0].replace(/\D/g, '');
    // Si il n'y a pas de slash (/), on met 1 par défaut
    const count = parts.length > 1? parseInt(parts[1]): 1;

    // 2. Validation (Minimum 5, Maximum 50)
    if (isNaN(count)) return await sock.sendMessage(jid, { text: "❌ Erreur: Le nombre précisé doit être un chiffre." });
    if (count < 5 || count > 50) return await sock.sendMessage(jid, { text: `❌ Le nombre de signalements doit être compris entre 5 et 50. (Tu as mis ${count})` });

    const jidToReport = `${number}@s.whatsapp.net`;

   try {
    // 3. Vérifier si le nombre existe sur WhatsApp
    const isRegistered = await sock.onWhatsApp(number);
    if (!isRegistered[0].exists) {
    return await sock.sendMessage(jid, { text: "❌ Ce numero n'est pas sur WhatsApp" });
 }

    // 4. BOUCLE EN MASSE (Report Loop)
    await sock.sendMessage(jid, { text: `👀 Envoi de ${count} signalements en cours...` });

    for (let i = 0; i < count; i++) {
   try {
    // Appel direct du système de signalement
    await sock.reportContact(jidToReport, 'spam');
  
    // Petit délai entre chaque signal (pour ne pas bloquer le bot)
    if (i < count - 1) {
    await new Promise(resolve => setTimeout(resolve, 600)); 
   }
    } catch (reportErrors) {
    // On continue si une erreur survient sur UN signal, sauf si c'est fatidique
    // console.log(`Erreur signalement n°${i}:`, reportErrors);
   }
 }

    // 5. Confirmation à la fin
    await sock.sendMessage(jid, { text: "✅ Signalements envoyés en masse." });

    } catch (error) {
    await sock.sendMessage(jid, { text: "❌ Erreur de connexion ou plus de allowance de WhatsApp." });
   }
  },
}
