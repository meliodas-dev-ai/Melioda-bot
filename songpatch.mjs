import fs from 'fs'
let c = fs.readFileSync('lib/categories.js', 'utf8')
if (!c.includes("'MUSIC'")) {
  c = c.replace("  ['🧰', 'TOOLS'", "  ['🎵', 'MUSIC', ['song']],\n  ['🧰', 'TOOLS'")
  fs.writeFileSync('lib/categories.js', c)
}
let a = fs.readFileSync('lib/aideTer.js', 'utf8')
if (!a.includes('song:')) {
  a = a.replace('export const aideTer = {', 'export const aideTer = {\n  song: "Cherche une chanson et envoie les liens de YouTube et Spotify. Utilisation : .song <titre ou artiste>",')
  fs.writeFileSync('lib/aideTer.js', a)
}
console.log(c.includes("'MUSIC'") && a.includes('song:') ? '✅ menu et aide mis à jour' : '❌ à vérifier')
