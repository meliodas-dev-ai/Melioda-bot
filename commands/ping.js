export default {
  nom: 'ping',
  run: async ({ sock, jid, msg }) => {
    const ms = Math.max(0, Date.now() - Number(msg.messageTimestamp) * 1000)
    await sock.sendMessage(jid, { text: `pong 🏓 ${ms} ms` })
  },
}
