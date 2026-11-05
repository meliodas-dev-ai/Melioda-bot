import fs from 'fs'
const f = 'commands/autostylemenu.js'
let s = fs.readFileSync(f, 'utf8')
if (s.includes("'stymenu'")) { console.log('✅ alias déjà présent'); process.exit(0) }
s = s.replace("alias: ['autostyle'],", "alias: ['autostyle', 'stymenu', 'styles2'],")
fs.writeFileSync(f, s)
console.log(s.includes("'stymenu'") ? '✅ .stymenu ajouté' : '❌ à vérifier')
