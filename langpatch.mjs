import fs from 'fs'
let g = fs.readFileSync('lib/gestionnaire.js', 'utf8')
const a = g
if (!g.includes("from './langue.js'")) {
  g = g.replace("import { habiller } from './style.js'", "import { habiller } from './style.js'\nimport { traduire } from './langue.js'")
}
g = g.replace('sock.sendMessage = (j, c, o) => envoi(j, habiller(c), o)', 'sock.sendMessage = (j, c, o) => envoi(j, habiller(traduire(j, c)), o)')
console.log(g !== a && g.includes('traduire(j, c)') ? '✅ traduction branchée' : '❌ à vérifier, ne relance rien')
fs.writeFileSync('lib/gestionnaire.js', g)

let c = fs.readFileSync('lib/categories.js', 'utf8')
if (!c.includes("'lang'")) c = c.replace("['🧠', 'BOT INFO', ['botinfo', 'chaineinfo',", "['🧠', 'BOT INFO', ['botinfo', 'chaineinfo', 'lang',")
fs.writeFileSync('lib/categories.js', c)

let t = fs.readFileSync('lib/aideTer.js', 'utf8')
if (!t.includes('lang:')) t = t.replace('export const aideTer = {', 'export const aideTer = {\n  lang: "Choisit la langue du bot dans cette discussion ou ce groupe. Utilisation : .lang fr ou .lang en",')
fs.writeFileSync('lib/aideTer.js', t)
