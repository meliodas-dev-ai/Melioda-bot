import fs from 'fs'
let c = fs.readFileSync('lib/categories.js', 'utf8')
if (!c.includes("'lockgroup'")) {
  c = c.replace("'goodbye', 'groupid'", "'backupconfig', 'ghostmode', 'goodbye', 'groupid'")
  c = c.replace("'kick', 'leave', 'link'", "'antitagall', 'kick', 'leave', 'link', 'lockgroup', 'raidguard', 'restoreconfig'")
  fs.writeFileSync('lib/categories.js', c)
}
let a = fs.readFileSync('lib/aideTer.js', 'utf8')
if (!a.includes('lockgroup:')) {
  a = a.replace('export const aideTer = {', 'export const aideTer = {\n  lockgroup: "Verrouille le groupe pendant un temps, puis le rouvre. Utilisation : .lockgroup <minutes> (admin)",\n  antitagall: "Supprime les mentions massives (10 et plus) envoyées par les non-admins. .antitagall on/off (admin)",\n  raidguard: "Verrouille le groupe si trop de personnes arrivent en même temps. .raidguard on/off (admin)",\n  ghostmode: "Coupe les messages automatiques de bienvenue et de départ dans le groupe. .ghostmode on/off (admin)",\n  backupconfig: "Sauvegarde les réglages du groupe. Utilisation : .backupconfig (admin)",\n  restoreconfig: "Restaure la dernière sauvegarde des réglages. Utilisation : .restoreconfig (admin)",')
  fs.writeFileSync('lib/aideTer.js', a)
}
console.log(c.includes("'lockgroup'") && a.includes('lockgroup:') ? '✅ menu et aide mis à jour' : '❌ à vérifier')
