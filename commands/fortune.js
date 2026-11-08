const predictions = [
  'Une bonne nouvelle arrive dans les prochains jours.',
  'Prends le temps de finir ce que tu as commencé.',
  'Un message inattendu t’apportera une idée utile.',
  'Reste calme : la journée se passera mieux que prévu.',
  'Quelqu’un pense à toi plus que tu ne le crois.',
]
export default {
  nom: 'fortune',
  run: async ({ sock, jid }) => {
    const p = predictions[Math.floor(Math.random() * predictions.length)]
    await sock.sendMessage(jid, { text: `🔮 ${p}\n\n(Prédiction fictive, pour s'amuser.)` })
  },
}
