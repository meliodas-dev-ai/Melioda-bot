const enigmes = [
  { q: 'Je suis plein de trous, mais je retiens l\'eau. Que suis-je ?', r: 'une éponge', mots: ['eponge'] },
  { q: 'Plus on m\'enlève, plus je deviens grand. Que suis-je ?', r: 'un trou', mots: ['trou'] },
  { q: 'Je parle sans bouche et j\'entends sans oreilles. Que suis-je ?', r: 'un écho', mots: ['echo'] },
  { q: 'Qu\'est-ce qui monte toujours et ne descend jamais ?', r: 'l\'âge', mots: ['age'] },
  { q: 'J\'ai des villes sans maisons, des forêts sans arbres et de l\'eau sans poissons. Que suis-je ?', r: 'une carte', mots: ['carte'] },
  { q: 'Qu\'est-ce qui t\'appartient, mais que les autres utilisent plus que toi ?', r: 'ton prénom', mots: ['prenom', 'nom'] },
]
const parties = new Map()
const norm = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').trim()

export default {
  nom: 'riddle',
  run: async ({ sock, jid, args, config }) => {
    const partie = parties.get(jid)
    const saisie = args.join(' ')
    if (saisie && partie && Date.now() <= partie.expire) {
      if (norm(saisie) === 'reponse') {
        parties.delete(jid)
        return sock.sendMessage(jid, { text: `💡 La répo
cat > commands/ship.js << 'EOF'
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default {
  nom: 'ship',
  run: async ({ sock, jid, args, config }) => {
    if (args.length < 2) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}ship <nom1> <nom2>` })
    }
    const [a, b] = [args[0], args[1]]
    const cle = [norm(a), norm(b)].sort().join('|')
    let h = 7
    for (const c of cle) h = (h * 31 + c.charCodeAt(0)) % 101
    const message =
      h >= 85 ? 'Une alchimie incroyable ! ✨'
      : h >= 60 ? 'Il y a de belles chances 😄'
      : h >= 35 ? 'Pourquoi pas, avec un peu d\'efforts 🙂'
      : 'Mieux vaut rester bons amis 😅'
    await sock.sendMessage(jid, { text: `💞 ${a} + ${b} = ${h} %\n\n${message}\n\n(Juste pour s'amuser !)` })
  },
}
