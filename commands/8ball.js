const reponses = [
  'Oui, sans aucun doute.',
  'Tout indique que oui.',
  'Probablement.',
  'Je ne peux pas le dire maintenant.',
  'Demande-moi plus tard.',
  'Je ne compterais pas dessus.',
  'Les signes disent non.',
  'Non, certainement pas.',
]

export default {
  nom: '8ball',
  run: async ({ sock, jid, args, config }) => {
    if (!args.length) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}8ball <question>` })
    const r = reponses[Math.floor(Math.random() * reponses.length)]
    await sock.sendMessage(jid, { text: `🎱 ${r}` })
  },
}
