import fs from 'fs'
const f = 'lib/aideTer.js'
let s = fs.readFileSync(f, 'utf8')
if (s.includes('styles:')) { console.log('✅ aide déjà présente'); process.exit(0) }
s = s.replace('export const aideTer = {', 'export const aideTer = {\n  styles: "Affiche les styles d\'écriture, par pages. Utilisation : .styles [page]",')
fs.writeFileSync(f, s)
console.log('✅ aide ajoutée')
