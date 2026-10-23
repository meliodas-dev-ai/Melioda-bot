export default {
  nom: 'botinfo',
  run: async ({ sock, jid, commandes, config }) => {
    const total = new Set([...commandes.values()].map((c) => c.nom)).size
    const texte =
      `🤖 *${config.nomBot}*\n\n` +
      `Version : ${config.version}\n` +
      `Préfixe : ${config.prefix}\n` +
      `Commandes : ${total}\n` +
      `Développeur : ${config.developpeur}\n\n` +
      `${config.signature}\n${config.devise}`
    await sock.sendMessage(jid, { text: texte })
  },
}
