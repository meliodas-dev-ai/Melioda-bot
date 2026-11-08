import fs from 'fs'
const f = 'public/index.html'
let s = fs.readFileSync(f, 'utf8')
const bloc = `const SERVEURS = [
    { nom: 'Serveur 1', url: 'https://melioda-bot-nmnv.onrender.com' },
    { nom: 'Serveur 2', url: 'https://melioda-bot.onrender.com' },
    { nom: 'Serveur 3', url: 'https://melioda-bot-1.onrender.com' },
    { nom: 'Serveur 4', url: 'https://melioda-bot-2.onrender.com' },
    { nom: 'Serveur 5', url: 'https://melioda-bot-3.onrender.com' },
  ]`
const avant = s
s = s.replace(/const SERVEURS = \[[\s\S]*?\n  \]/, bloc)
if (s === avant) console.log('❌ bloc SERVEURS introuvable, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ 5 serveurs WhatsApp dans la page') }
