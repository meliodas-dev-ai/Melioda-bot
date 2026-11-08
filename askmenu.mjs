import fs from 'fs'
let c = fs.readFileSync('lib/categories.js', 'utf8')
if (!c.includes("'ask'")) {
  c = c.replace("['weather', 'wiki']", "['ask', 'weather', 'wiki']")
  fs.writeFileSync('lib/categories.js', c)
}
let a = fs.readFileSync('lib/aideTer.js', 'utf8')
if (!a.includes('ask:')) {
  a = a.replace('export const aideTer = {', 'export const aideTer = {\n  ask: "Cherche une question dans Wikipédia et renvoie l\'extrait trouvé, avec la source. Utilisation : .ask <question>",')
  fs.writeFileSync('lib/aideTer.js', a)
}
console.log(c.includes("'ask'") && a.includes('ask:') ? '✅ menu et aide mis à jour' : '❌ à vérifier')
