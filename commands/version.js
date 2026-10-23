export default {
  nom: 'version',
  run: async ({ sock, jid, config }) => {
    await sock.sendMessage(jid, { text: `🤖 ${config.nomBot} — version ${config.version}` })
  },
}
