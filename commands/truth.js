const questions = [
  'Quelle est la dernière chose que tu as cherchée sur Internet ?',
  'Quel est ton plus grand rêve ?',
  "Quelle est la chose la plus drôle qui te soit arrivée à l'école ?",
  'Quel talent caché as-tu ?',
  'Quelle est ta plus grande peur ?',
  'Quel est le meilleur conseil que tu aies reçu ?',
  'Quelle application utilises-tu le plus sur ton téléphone ?',
  'Si tu pouvais voyager n\'importe où demain, où irais-tu ?',
]

export default {
  nom: 'truth',
  run: async ({ sock, jid }) => {
    const q = questions[Math.floor(Math.random() * questions.length)]
    await sock.sendMessage(jid, { text: `🫣 Vérité\n\n${q}` })
  },
}
