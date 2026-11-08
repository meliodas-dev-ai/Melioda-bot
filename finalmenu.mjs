import fs from 'fs'
let c = fs.readFileSync('lib/categories.js', 'utf8')
if (!c.includes("'image'")) c = c.replace("['ask', 'weather', 'wiki']", "['ask', 'image', 'weather', 'wiki']")
if (!c.includes("'godmode'")) c = c.replace("['backup', 'ban',", "['backup', 'ban', 'godmode',")
fs.writeFileSync('lib/categories.js', c)

let a = fs.readFileSync('lib/aideTer.js', 'utf8')
if (!a.includes('godmode:')) {
  a = a.replace('export const aideTer = {', `export const aideTer = {
  godmode: "Tableau de bord du propriétaire : commandes, comptes connectés, mode. Utilisation : .godmode",
  image: "Cherche une image libre dans Wikimedia Commons, avec sa source. Utilisation : .image <sujet>",`)
  fs.writeFileSync('lib/aideTer.js', a)
}
console.log(c.includes("'image'") && c.includes("'godmode'") && a.includes('image:') ? '✅ menu et aide mis à jour' : '❌ à vérifier')
