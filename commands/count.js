export default {
  nom: 'count',
  run: async ({ sock, jid, args, config }) => {
    const texte = args.join(' ')
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}count <texte>` })
    const caracteres = [...texte].length
    const mots = texte.trim().split(/\s+/).length
    await sock.sendMessage(jid, { text: `📝 ${caracteres} caractères, ${mots} mots` })
  },
}
