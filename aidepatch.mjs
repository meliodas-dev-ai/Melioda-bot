import fs from 'fs'
const f = 'lib/aideTer.js'
let s = fs.readFileSync(f, 'utf8')
if (s.includes('autostyle:')) { console.log('✅ aide déjà présente'); process.exit(0) }
s = s.replace('export const aideTer = {', 'export const aideTer = {\n  autostyle: "Réécrit tes messages dans le style choisi. .autostyle on | off | <numéro> (propriétaire).",\n  signal: "Signale un message à l’administrateur du bot. Réponds au message avec .signal",')
fs.writeFileSync(f, s)
console.log('✅ aide ajoutée')
