export default {
  nom: 'lower',
  run: async ({ sock, jid, args, config }) => {
    const texte = args.join(' ')
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}lower <texte>` })
    await sock.sendMessage(jid, { text: texte.toLowerCase() })
  },
}
