import fs from 'fs'
const f = 'public/index.html'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace('placeholder="+243 900 457 430"', 'placeholder="+509 3700 1234"')
s = s.replace('Exemples : +243900457430, +33612345678, +14155550123', 'Exemples : +50937001234, +243900457430, +33612345678')
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ exemple mis à jour') }
