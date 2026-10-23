export default {
  nom: 'dice',
  run: async ({ sock, jid }) => {
    const n = Math.floor(Math.random() * 6) + 1
    await sock.sendMessage(jid, { text: `🎲 Tu as obtenu : *${n}*` })
  },
}
