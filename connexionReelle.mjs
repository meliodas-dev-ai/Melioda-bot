import fs from 'fs'
let g = fs.readFileSync('lib/gestionnaire.js', 'utf8')
const debut = 'export async function demarrerAvecCode(numero) {'
if (!g.includes(debut)) { console.log('❌ fonction introuvable, dis-le-moi'); process.exit(1) }
const nouvelle = `export async function demarrerAvecCode(numero) {
  const vivante = sessions.get(numero)
  if (vivante?.connecte === true) throw new Error('DEJA_LIE')
  let enregistre = false
  if (mongoActif()) enregistre = (await lireDoc(\`auth|\${numero}|creds\`))?.registered === true
  if (vivante || enregistre) await nettoyerNumero(numero)
  const connectes = [...sessions.values()].filter((s) => s.connecte === true).length
  if (connectes >= Number(process.env.MAX_COMPTES || 4)) throw new Error('SATURE')
  const enAttente = [...sessions.values()].filter((s) => !s.state.creds.registered).length
  if (enAttente >= MAX_EN_ATTENTE) throw new Error('SATURE')
  const code = await demarrer(numero, true)
  if (mongoActif()) await ecrireDoc(\`affect|\${numero}\`, MON_ID)
  return code
}
`
g = g.replace(/export async function demarrerAvecCode\(numero\) \{[\s\S]*?\n\}\n/, nouvelle)
fs.writeFileSync('lib/gestionnaire.js', g)
console.log('✅ connexion basée sur la connexion réelle')
