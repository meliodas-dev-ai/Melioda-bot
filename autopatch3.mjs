import fs from 'fs'
const f = 'lib/style.js'
let s = fs.readFileSync(f, 'utf8')
if (s.includes('contenu.sendBrut')) { console.log('✅ déjà corrigé'); process.exit(0) }
s = s.replace(
  "export function habiller(contenu) {\n  if (!contenu || contenu.delete) return contenu",
  "export function habiller(contenu) {\n  if (!contenu || contenu.delete) return contenu\n  if (contenu.sendBrut) {\n    const { sendBrut, ...propre } = contenu\n    return propre\n  }"
)
fs.writeFileSync(f, s)
console.log(s.includes('contenu.sendBrut') ? '✅ style respecte le drapeau' : '❌ à vérifier')
