export default {
  nom: 'date',
  run: async ({ sock, jid }) => {
    const d = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    await sock.sendMessage(jid, { text: `📅 ${d}` })
  },
}
