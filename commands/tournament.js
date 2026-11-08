export default {
  nom: 'tournament',
  run: async ({ sock, jid, config }) => {
    await sock.sendMessage(jid, {
      text: `🏆 Tournoi\n\nLes tournois ne sont pas encore disponibles dans cette version.\nTape ${config.prefix}boss pour un défi individuel.`,
    })
  },
}
