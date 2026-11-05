import fs from 'fs'
const f = 'lib/telegram.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace("text: `📢 Chaîne ${i + 1} : ${c}`", "text: `📢 Chaîne ${i + 1}`")
s = s.replace("text: '📢 Rejoindre ' + c", "text: '📢 Rejoindre la chaîne ' + (CANAUX.indexOf(c) + 1)")
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ noms de chaînes masqués') }
