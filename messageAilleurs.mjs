import fs from 'fs'
let s = fs.readFileSync('server.js', 'utf8')
if (s.includes('AILLEURS')) { console.log('✅ déjà présent'); process.exit(0) }
const avant = s
s = s.replace('const messages = {', "const messages = {\n      AILLEURS: 'Ce numéro est déjà connecté sur un autre serveur. Déconnecte-le dans Appareils connectés, puis réessaie.',")
if (s === avant) console.log('❌ ancre introuvable, dis-le-moi')
else { fs.writeFileSync('server.js', s); console.log('✅ message AILLEURS branché') }
