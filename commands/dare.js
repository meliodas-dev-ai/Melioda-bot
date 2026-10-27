const defis = [
  'Envoie un message vocal en chantant le refrain de ta chanson préférée.',
  'Écris ton prochain message uniquement en majuscules.',
  "Mets un emoji comme photo de profil pendant une heure.",
  'Fais dix squats et dis combien tu en as fait.',
  'Raconte une blague à la dernière personne avec qui tu as discuté.',
  "Parle avec l'accent de ton choix dans ton prochain vocal.",
  'Envoie un compliment sincère à quelqu\'un du groupe.',
  'Décris ta journée en trois emojis seulement.',
]

export default {
  nom: 'dare',
  run: async ({ sock, jid }) => {
    const d = defis[Math.floor(Math.random() * defis.length)]
    await sock.sendMessage(jid, { text: `😈 Défi\n\n${d}` })
  },
}
