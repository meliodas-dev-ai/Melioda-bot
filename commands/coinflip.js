export default {
  nom: 'coinflip',
  run: async ({ sock, jid }) => {
    const r = Math.random() < 0.5 ? 'PILE' : 'FACE'
    await sock.sendMessage(jid, { text: `🪙 Résultat : *${r}*` })
  },
}
