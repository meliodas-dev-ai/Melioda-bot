import fs from 'fs'
let c = fs.readFileSync('lib/categories.js', 'utf8')
c = c.replace("['🎨', 'AUTO STYLE', ['autostyle', 'autostylemenu']],", "['🎨', 'STYMENU', ['stymenu']],")
fs.writeFileSync('lib/categories.js', c)
let m = fs.readFileSync('commands/menu.js', 'utf8')
m = m.replace("  ['autostyle', 'AUTO STYLE'],", "  ['stymenu', 'STYMENU'],")
fs.writeFileSync('commands/menu.js', m)
console.log(c.includes("'STYMENU'") && m.includes("'STYMENU'") ? '✅ affichage STYMENU' : '❌ à vérifier')
