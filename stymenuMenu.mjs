import fs from 'fs'
let m = fs.readFileSync('commands/menu.js', 'utf8')
m = m.replace(/\n\s*\['(stymenu|autostyle)', '(STYMENU|AUTO STYLE)'\],/g, '')
if (!m.includes('stymenu`)')) {
  m = m.replace('lignes.push(`${p}allmenu`)', "if (noms.includes('stymenu')) lignes.push(`${p}stymenu`)\n      lignes.push(`${p}allmenu`)")
}
fs.writeFileSync('commands/menu.js', m)

let c = fs.readFileSync('lib/categories.js', 'utf8')
c = c.replace("'reverse', 'styles', 'upper'", "'reverse', 'upper'")
c = c.replace(/\['🎨', '(STYMENU|AUTO STYLE)', \[[^\]]*\]\],/, "['🎨', 'STYMENU', ['stymenu', 'sty']],")
fs.writeFileSync('lib/categories.js', c)

let a = fs.readFileSync('lib/aideTer.js', 'utf8')
if (!a.includes('stymenu:')) {
  a = a.replace('export const aideTer = {', 'export const aideTer = {\n  stymenu: "Affiche le menu des styles, par pages. Utilisation : .stymenu [page]",\n  sty: "Choisit le style d\'écriture automatique. Utilisation : .sty <numéro> ou .sty off",')
}
fs.writeFileSync('lib/aideTer.js', a)
console.log('✅ menu, catégorie et aide mis à jour')
