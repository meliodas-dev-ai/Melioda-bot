import fs from 'fs'
let s = fs.readFileSync('server.js', 'utf8')
if (s.includes('DEJA_CONNECTE_PARTOUT')) { console.log('✅ déjà présent'); process.exit(0) }
const avant = s
s = s.replace('const messages = {', "const messages = {\n      DEJA_CONNECTE_PARTOUT: 'Ce numéro est déjà connecté. Déconnecte-le dans Appareils connectés, puis réessaie.',")
if (s === avant) console.log('❌ ancre introuvable')
else { fs.writeFileSync('server.js', s); console.log('✅ message ajouté') }
