const questions = [
  { q: "Quelle est la capitale de l'Australie ?", choix: ['Sydney', 'Canberra', 'Melbourne'], bonne: 1 },
  { q: 'Quelle planète est la plus proche du Soleil ?', choix: ['Vénus', 'Mars', 'Mercure'], bonne: 2 },
  { q: 'Quel est le plus grand océan du monde ?', choix: ['Atlantique', 'Pacifique', 'Indien'], bonne: 1 },
  { q: 'Combien de côtés a un hexagone ?', choix: ['5', '6', '8'], bonne: 1 },
  { q: 'Qui a peint la Joconde ?', choix: ['Michel-Ange', 'Van Gogh', 'Léonard de Vinci'], bonne: 2 },
  { q: "Quel est le symbole chimique de l'or ?", choix: ['Ag', 'Au', 'Or'], bonne: 1 },
  { q: "Quelle est la formule chimique de l'eau ?", choix: ['CO2', 'H2O', 'O2'], bonne: 1 },
  { q: 'Quelle est la capitale de la République démocratique du Congo ?', choix: ['Lubumbashi', 'Kinshasa', 'Goma'], bonne: 1 },
  { q: "En quelle année l'être humain a-t-il marché sur la Lune pour la première fois ?", choix: ['1959', '1969', '1979'], bonne: 1 },
]
const lettres = ['A', 'B', 'C']
const parties = new Map()

export default {
  nom: 'quiz',
  run: async ({ sock, jid, args, config }) => {
    const reponse = (args[0] || '').toUpperCase()
    if (lettres.includes(reponse)) {
      const partie = parties.get(jid)
      if (!partie || Date.now() > partie.expire) {
        return sock.sendMessage(jid, { text: `Aucun quiz en cours. Tape ${config.prefix}quiz pour en lancer un.` })
      }
      parties.delete(jid)
      const juste = lettres[partie.bonne]
      const texte = reponse === juste ? '🎉 Bonne réponse !' : `❌ Raté ! La bonne réponse était ${juste} : ${partie.texte}`
      return sock.sendMessage(jid, { text: texte })
    }
    const { q, choix, bonne } = questions[Math.floor(Math.random() * questions.length)]
    parties.set(jid, { bonne, texte: choix[bonne], expire: Date.now() + 5 * 60 * 1000 })
    const lignes = choix.map((c, k) => `${lettres[k]}) ${c}`).join('\n')
    await sock.sendMessage(jid, { text: `🧠 Quiz\n\n${q}\n\n${lignes}\n\nRéponds avec ${config.prefix}quiz A, B ou C` })
  },
}
