import fs from 'fs'
let c = fs.readFileSync('lib/categories.js', 'utf8')
const ajouts = [
  ["'FUN & GAMES', [", ['badge', 'rank']],
  ["'TOOLS', [", ['repo', 'serverinfo', 'jsonformat']],
  ["'GROUP MENU', [", ['groupage']],
  ["'USER MENU', [", ['memory']],
]
for (const [ancre, noms] of ajouts) {
  for (const n of noms) {
    if (!c.includes(`'${n}'`)) c = c.replace(ancre, `${ancre}'${n}', `)
  }
}
fs.writeFileSync('lib/categories.js', c)

let a = fs.readFileSync('lib/aideTer.js', 'utf8')
if (!a.includes('rank:')) {
  a = a.replace('export const aideTer = {', `export const aideTer = {
  rank: "Affiche ton niveau et ton XP (même progression que .rpg). Utilisation : .rank",
  badge: "Affiche tes badges selon ton niveau. Utilisation : .badge",
  repo: "Affiche les infos d'un dépôt GitHub public. Utilisation : .repo <utilisateur/depot>",
  serverinfo: "Affiche la version de Node et du système, sans informations secrètes. Utilisation : .serverinfo",
  jsonformat: "Met un JSON en forme. Utilisation : .jsonformat {\\"nom\\":\\"Meliodas\\"}",
  groupage: "Affiche la date de création et l'âge du groupe. Utilisation : .groupage",
  memory: "Tes souvenirs personnels, visibles seulement par toi, en privé. Utilisation : .memory add <texte> | .memory clear",`)
  fs.writeFileSync('lib/aideTer.js', a)
}
console.log(c.includes("'badge'") && c.includes("'memory'") && a.includes('rank:') ? '✅ menu et aide mis à jour' : '❌ à vérifier')
