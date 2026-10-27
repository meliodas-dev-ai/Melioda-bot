const choix = { pierre: '🪨', feuille: '📄', papier: '📄', ciseaux: '✂️' }
const bat = { pierre: 'ciseaux', feuille: 'pierre', ciseaux: 'feuille' }

export default {
  nom: 'rps',
  run: async ({ sock, jid, args, config }) => {
    let joueur = (args[0] || '').toLowerCase()
    if (joueur === 'papier') joueur = 'feuille'
    if (!bat[joueur]) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}rps pierre, feuille ou ciseaux` })
    }
    const options = Object.keys(bat)
    const bot = options[Math.floor(Math.random() * options.length)]
    const resultat = joueur === bot ? '🤝 Égalité !' : bat[joueur] === bot ? '🎉 Tu gagnes !' : '😎 Je gagne !'
    await sock.sendMessage(jid, { text: `Toi : ${choix[joueur]} ${joueur}\nMoi : ${choix[bot]} ${bot}\n\n${resultat}` })
  },
}
