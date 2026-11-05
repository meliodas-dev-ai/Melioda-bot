import fs from 'fs'
const f = 'lib/evenements.js'
let s = fs.readFileSync(f, 'utf8')
if (s.includes('await autostyle(sock, m)')) { console.log('✅ déjà branché'); process.exit(0) }
s = s.replace("import { police } from './police.js'", "import { police } from './police.js'\nimport { autostyle } from './autostyle.js'")
s = s.replace("        await modererMots(sock, m)\n", "        await modererMots(sock, m)\n        await autostyle(sock, m)\n")
fs.writeFileSync(f, s)
console.log(s.includes('await autostyle(sock, m)') ? '✅ écriture automatique branchée' : '❌ à vérifier')
