export default {
  nom: 'time',
  run: async ({ sock, jid }) => {
    const h = new Date().toLocaleTimeString('fr-FR')
    await sock.sendMessage(jid, { text: `🕐 ${h}` })
  },
}
