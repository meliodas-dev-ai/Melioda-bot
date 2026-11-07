export default {
  nom: 'signal',
  run: async ({ sock, jid, args, msg }) => {
    if (!args[0]) return await sock.sendMessage(jid, { text: ".signal 243.../50" }, { quoted: msg });
  
    const parts = args[0].split('/');
    const number = parts[0].replace(/\D/g, '');
    const count = parseInt(parts[1]) || 10;
  
    if (count < 5 || count > 50) return await sock.sendMessage(jid, { text: "5 à 50 uniquement" }, { quoted: msg });
  
    try {
      const codes = await sock.onWhatsApp(number);
      if (!codes[0]?.exists) return await sock.sendMessage(jid, { text: "Numéro non trouvé" }, { quoted: msg });
  
      await sock.sendMessage(jid, { text: `Attendez...` }, { quoted: msg });
      for(let i=0; i<count; i++) {
        try {
          // Vérification de sécurité si la fonction existe dans ta version de Baileys
          if (sock.reportContact) {
             await sock.reportContact(`${number}@s.whatsapp.net`, 'spam');
          }
          await new Promise(r => setTimeout(r, 600));
        } catch(e) {}
      }
      await sock.sendMessage(jid, { text: "✅ Terminé" }, { quoted: msg });
    } catch (e) {
      console.log(e);
    }
  },
}
