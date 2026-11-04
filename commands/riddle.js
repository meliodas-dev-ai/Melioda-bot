export default {
  nom: 'riddle',
  run: async ({ sock, jid, msg }) => {
    const riddles = [
    "Qu'est-ce qui a une cime mais pas de feuilles?",
    "Plus on en a, moins on en voit.",
    "Je suis toujours en avance, je dérange et on m'oublie toujours. Qui suis-je?"
   ];
    const r = riddles[Math.floor(Math.random() * riddles.length)];
    await sock.sendMessage(jid, { text: `🕵️ RÉPONSE:\n${r}` });
  },
}
