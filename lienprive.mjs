import fs from 'fs'
const f = 'lib/telegram.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(
  "const lienGroupe = () => (GROUPE.startsWith('@') ? `https://t.me/${GROUPE.slice(1)}` : null)",
  "const lienGroupe = () => process.env.TELEGRAM_GROUPE_LIEN || (GROUPE.startsWith('@') ? `https://t.me/${GROUPE.slice(1)}` : null)"
)
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ lien privé pris en compte') }
