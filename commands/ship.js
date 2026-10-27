const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default {
  nom: 'ship',
  run: async ({ sock, jid, args, config }) => {
    if (args.length < 2) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}ship <nom1> <nom2>` })
    }
    const [a, b] = [args[0], args[1]]
    const cle = [norm(a), norm(b)].sort().join('|')
    let h = 7
    for (const c of cle) h = (h * 31 + c.charCodeAt(0)) % 101
    const message =
      h >= 85 ? 'Une alchimie incroyable ! ✨'
      : h >= 60 ? 'Il y a de belles chances 😄'
      : h >= 35 ? 'Pourquoi pas, avec un peu d\'efforts 🙂'
      : 'Mieux vaut rester bons amis 😅'
    await sock.sendMessage(jid, { text: `💞 ${a} + ${b} = ${h} %\n\n${message}\n\n(Juste pour s'amuser !)` })
  },
}
