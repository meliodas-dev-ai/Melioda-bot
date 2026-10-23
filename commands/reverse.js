export default {
  nom: 'reverse',
  run: async ({ sock, jid, args, config }) => {
    const texte = args.join(' ')
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}reverse <texte>` })
    await sock.sendMessage(jid, { text: [...texte].reverse().join('') })
  },
}
