const quetes = [
  'Trouver trois objets dans le groupe.',
  'Poser une question intéressante.',
  'Partager un fait utile.',
  'Aider quelqu’un à résoudre un petit problème.',
]
export default {
  nom: 'quest',
  run: async ({ sock, jid }) => {
    const q = quetes[Math.floor(Math.random() * quetes.length)]
    await sock.sendMessage(jid, { text: `📜 Quête du jour\n\n${q}\n\nTape .daily pour récupérer ta récompense.` })
  },
}
