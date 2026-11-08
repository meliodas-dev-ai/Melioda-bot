import fs from 'fs'
let c = fs.readFileSync('lib/categories.js', 'utf8')
if (!c.includes("'boss'")) {
  c = c.replace("'8ball', 'choose', 'citation'", "'8ball', 'boss', 'choose', 'citation', 'daily', 'guild', 'inventory', 'quest', 'rpg', 'tournament'")
  fs.writeFileSync('lib/categories.js', c)
}
let a = fs.readFileSync('lib/aideTer.js', 'utf8')
if (!a.includes('rpg:')) {
  a = a.replace('export const aideTer = {', 'export const aideTer = {\n  rpg: "Fais progresser ton personnage (XP et niveau). Utilisation : .rpg",\n  quest: "Affiche une quête du jour. Utilisation : .quest",\n  inventory: "Affiche ton inventaire et ton or. Utilisation : .inventory",\n  daily: "Récompense quotidienne : or et XP. Utilisation : .daily",\n  boss: "Défi individuel contre un boss. Utilisation : .boss",\n  guild: "Création de guildes (pas encore disponible).",\n  tournament: "Tournois (pas encore disponibles).",')
  fs.writeFileSync('lib/aideTer.js', a)
}
console.log(c.includes("'boss'") && a.includes('rpg:') ? '✅ menu et aide mis à jour' : '❌ à vérifier')
