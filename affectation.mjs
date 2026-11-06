import fs from 'fs'
const f = 'lib/gestionnaire.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace("import { mongoActif, lireDoc, supprimerPrefixe, listerCreds } from './stockage.js'",
  "import { mongoActif, lireDoc, ecrireDoc, supprimerDoc, supprimerPrefixe, listerCreds } from './stockage.js'")
s = s.replace("const sessions = new Map()", "const MON_ID = String(process.env.SERVEUR_ID || '1')\nconst sessions = new Map()")
s = s.replace("  if (mongoActif()) supprimerPrefixe(`auth|${numero}|`).catch(() => {})",
  "  if (mongoActif()) { supprimerPrefixe(`auth|${numero}|`).catch(() => {}); supprimerDoc(`affect|${numero}`).catch(() => {}) }")
s = s.replace("  return demarrer(numero, true)\n}",
  "  const code = await demarrer(numero, true)\n  if (mongoActif()) await ecrireDoc(`affect|${numero}`, MON_ID)\n  return code\n}")
s = s.replace("    if (!/^\\d{8,15}$/.test(n) || !(await estLiee(n))) continue",
  "    if (!/^\\d{8,15}$/.test(n) || !(await estLiee(n)) || !(await estMien(n))) continue")
s = s.replace("export async function restaurerSessions() {",
  "async function estMien(numero) {\n  if (!mongoActif()) return true\n  const a = await lireDoc(`affect|${numero}`)\n  return a ? String(a) === MON_ID : MON_ID === '1'\n}\n\nexport async function restaurerSessions() {")
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ affectation par serveur ajoutée') }
