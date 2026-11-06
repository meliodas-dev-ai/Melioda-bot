import fs from 'fs'
const fichiers = ['lib/cadreBienvenue.js', 'lib/style.js', 'lib/styleTelegram.js', 'lib/accueilConnexion.js', 'commands/menu.js', 'commands/stymenu.js', 'config.js']
for (const f of fichiers) {
  if (!fs.existsSync(f)) continue
  const avant = fs.readFileSync(f, 'utf8')
  let s = avant
    .split("'POWERED BY MELIODAS DEV'").join("'POWERED BY MELIODAS DEV TECH'")
    .split("'MELIODAS DEV'").join("'MELIODAS DEV TECH'")
    .split("signature: 'POWERED BY MELIODAS DEV'").join("signature: 'POWERED BY MELIODAS DEV TECH'")
  if (f === 'lib/cadreBienvenue.js') {
    s = s.replace("import { numeroDe } from './groupe.js'", "import { numeroDe } from './groupe.js'\nimport { signature } from './signature.js'")
    s = s.replace("    `⛨ ${policeItalique('MELIODAS')} × ${police('DEV')}`,", '    signature(),')
  }
  if (s !== avant) { fs.writeFileSync(f, s); console.log('✅', f) }
}
