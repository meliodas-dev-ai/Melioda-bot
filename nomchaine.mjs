import fs from 'fs'
const f = 'lib/style.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace('newsletterName: chaine.nom,', "newsletterName: process.env.NOM_CHAINE || chaine.nom,")
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ nom de chaîne configurable') }
