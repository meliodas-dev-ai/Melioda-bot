const symboles = ['🍒', '🍋', '🍇', '⭐', '🔔', '7️⃣']

export default {
  nom: 'slot',
  run: async ({ sock, jid }) => {
    const tirage = [0, 1, 2].map(() => symboles[Math.floor(Math.random() * symboles.length)])
    const distincts = new Set(tirage).size
    const message = distincts === 1 ? '🎉 JACKPOT !' : distincts === 2 ? '😮 Presque !' : '😅 Pas cette fois, retente ta chance !'
    await sock.sendMessage(jid, { text: `🎰 ${tirage.join(' | ')}\n\n${message}\n(Jeu pour rire, sans argent.)` })
  },
}
