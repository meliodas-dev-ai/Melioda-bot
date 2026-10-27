export default {
  nom: 'poll',
  run: async ({ sock, jid, args, config }) => {
    const parties = args.join(' ').split('|').map((s) => s.trim()).filter(Boolean)
    if (parties.length < 3 || parties.length > 13) {
      return sock.sendMessage(jid, {
        text: `Utilisation : ${config.prefix}poll Question | Option 1 | Option 2\n(de 2 à 12 options, séparées par |)`,
      })
    }
    const [name, ...values] = parties
    await sock.sendMessage(jid, { poll: { name, values, selectableCount: 1 } })
  },
}
