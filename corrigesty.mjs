import fs from 'fs'
let s = fs.readFileSync('lib/style.js', 'utf8')
if (!s.includes('avecChaine')) {
  s = s.replace(
    "    const { sendBrut, ...propre } = contenu\n    return propre",
    "    const { sendBrut, avecChaine, ...propre } = contenu\n    if (avecChaine) return { ...propre, contextInfo: { ...(propre.contextInfo || {}), ...contexte() } }\n    return propre"
  )
  fs.writeFileSync('lib/style.js', s)
}
console.log(s.includes('avecChaine') ? '✅ bouton chaîne gardé sans cadre' : '❌ à vérifier')
