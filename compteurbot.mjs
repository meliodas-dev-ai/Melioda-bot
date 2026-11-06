import fs from 'fs'
const f = 'public/index.html'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(
  "document.getElementById('nb').textContent = r.connectes + ' / ' + r.max",
  "document.getElementById('nb').textContent = r.connectes"
)
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ compteur simplifié') }
