export default {
  nom: 'choose',
  run: async ({ sock, jid, args, config }) => {
    const options = args.join(' ').split('|').map((s) => s.trim()).filter(Boolean)
    if (options.length < 2) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}choose pizza | riz | pâtes` })
    }
    const choix = options[Math.floor(Math.random() * options.length)]
    await sock.sendMessage(jid, { text: `🎯 Je choisis : ${choix}` })
  },
}
