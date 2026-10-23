export default {
  nom: 'upper',
  run: async ({ sock, jid, args, config }) => {
    const texte = args.join(' ')
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}upper <texte>` })
    await sock.sendMessage(jid, { text: texte.toUpperCase() })
  },
}
