export default {
  nom: 'guild',
  run: async ({ sock, jid, config }) => {
    await sock.sendMessage(jid, {
      text: `🏰 Guildes\n\nLa création de guildes n'est pas encore disponible dans cette version.\nTape ${config.prefix}rpg pour progresser seul.`,
    })
  },
}
