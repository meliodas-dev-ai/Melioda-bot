export default {
  nom: 'random',
  run: async ({ sock, jid, args, config }) => {
    let min = 1
    let max = 100
    if (args.length === 1) max = parseInt(args[0], 10)
    if (args.length >= 2) {
      min = parseInt(args[0], 10)
      max = parseInt(args[1], 10)
    }
    if (!Number.isInteger(min) || !Number.isInteger(max) || min >= max || Math.abs(min) > 1e9 || Math.abs(max) > 1e9) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}random [min] [max]\nExemple : ${config.prefix}random 1 50` })
    }
    const n = Math.floor(Math.random() * (max - min + 1)) + min
    await sock.sendMessage(jid, { text: `🎲 Entre ${min} et ${max} : ${n}` })
  },
}
