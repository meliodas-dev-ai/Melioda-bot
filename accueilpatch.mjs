import fs from 'fs'
const f = 'lib/evenements.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(/    dernierAccueil\.set\(moi, Date\.now\(\)\)\n    await new Promise\(\(r\) => setTimeout\(r, 2000\)\)\n    try \{\n      await sock\.sendMessage\(moi \+ '@s\.whatsapp\.net', \{ text: accueil\(sock, config\) \}\)\n    \} catch \(e\) \{\n      console\.log\('⚠️ Message d accueil -', e\.message\)\n    \}/,
  "    dernierAccueil.set(moi, Date.now())\n    await new Promise((r) => setTimeout(r, 2000))\n    try {\n      await envoyerAccueil(sock, moi + '@s.whatsapp.net', config)\n    } catch (e) {\n      console.log('⚠️ Message d accueil -', e.message)\n    }")
s = s.replace("import { police } from './police.js'", "import { police } from './police.js'\nimport { envoyerAccueil } from './accueilConnexion.js'")
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ accueil avec photo branché') }
