import fs from 'fs'
const f = 'public/index.html'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(
  "    tete.textContent = p ? `${p[0]} ${p[1]} · +${p[2]}` : 'Choisis ton pays'",
  "    if (p) tete.textContent = `${p[0]} ${p[1]} · +${p[2]}`\n    else if (d.length >= 1) tete.textContent = `🌍 Pays inconnu · +${d.slice(0, 3)}`\n    else tete.textContent = 'Choisis ton pays'"
)
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ pays inconnu affiché') }
