const blagues = [
  'Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans le bateau.',
  "Que dit un escargot qui traverse une route à toute vitesse ? Wouhouuu !",
  "Pourquoi les canards sont-ils toujours à l'heure ? Parce qu'ils sont dans l'étang.",
  "Quel est le comble pour un électricien ? De ne pas être au courant.",
  "Pourquoi l'ordinateur va-t-il chez le médecin ? Parce qu'il a un virus.",
]

export default {
  nom: 'joke',
  run: async ({ sock, jid }) => {
    const b = blagues[Math.floor(Math.random() * blagues.length)]
    await sock.sendMessage(jid, { text: `😂 ${b}` })
  },
}
