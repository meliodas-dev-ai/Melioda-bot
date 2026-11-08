import fs from 'fs'
let g = fs.readFileSync('lib/gestionnaire.js', 'utf8')
if (g.includes('DEJA_CONNECTE_PARTOUT')) { console.log('✅ déjà présent'); process.exit(0) }
const avant = g
g = g.replace(
  "  const connectes = [...sessions.values()].filter((s) => s.state.creds.registered).length",
  `  if (mongoActif()) {
    const creds = await lireDoc(\`auth|\${numero}|creds\`)
    if (creds?.registered === true) throw new Error('DEJA_CONNECTE_PARTOUT')
  }
  const connectes = [...sessions.values()].filter((s) => s.state.creds.registered).length`
)
if (g === avant) console.log('❌ ancre introuvable, dis-le-moi')
else { fs.writeFileSync('lib/gestionnaire.js', g); console.log('✅ refus ajouté') }
