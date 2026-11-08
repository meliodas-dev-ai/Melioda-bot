import fs from 'fs'
let c = fs.readFileSync('lib/categories.js', 'utf8')
if (!c.includes("'npm'")) {
  c = c.replace("'short', 'speed']", "'short', 'speed', 'colorinfo', 'fortune', 'github', 'nickname', 'npm']")
  fs.writeFileSync('lib/categories.js', c)
}
let a = fs.readFileSync('lib/aideTer.js', 'utf8')
if (!a.includes('fortune:')) {
  a = a.replace('export const aideTer = {', 'export const aideTer = {\n  fortune: "Donne une prédiction fictive, pour s\'amuser. Utilisation : .fortune",\n  nickname: "Propose des surnoms. Utilisation : .nickname [nom]",\n  colorinfo: "Affiche les infos d\'une couleur HEX. Utilisation : .colorinfo #FF3B4F",\n  github: "Affiche un profil GitHub public. Utilisation : .github <pseudo>",\n  npm: "Affiche un package npm public. Utilisation : .npm <nom>",')
  fs.writeFileSync('lib/aideTer.js', a)
}
console.log(c.includes("'npm'") && a.includes('npm:') ? '✅ menu et aide mis à jour' : '❌ à vérifier')
