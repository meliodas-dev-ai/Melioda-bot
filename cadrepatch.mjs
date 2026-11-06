import fs from 'fs'

let e = fs.readFileSync('lib/evenements.js', 'utf8')
const avantE = e
e = "import { cadreBienvenue } from './cadreBienvenue.js'\n" + e
e = e.replace('const texte = messageFinal(type, id, ids, meta.subject, config)', 'const texte = cadreBienvenue(type, id, ids, meta, config)')
e = e.replace('{ image, caption: texte, mentions: ids }', '{ image, caption: texte, mentions: ids, sendBrut: true, avecChaine: true }')
e = e.replace('{ text: texte, mentions: ids }', '{ text: texte, mentions: ids, sendBrut: true, avecChaine: true }')
fs.writeFileSync('lib/evenements.js', e)
console.log(e !== avantE ? '✅ arrivée et départ mis à jour' : '❌ evenements non modifié')

let b = fs.readFileSync('lib/bienvenue.js', 'utf8')
const avantB = b
b = "import { cadreBienvenue } from './cadreBienvenue.js'\n" + b
b = b.replace('messageFinal(type, jid, [moi], meta.subject, config)', 'cadreBienvenue(type, jid, [moi], meta, config)')
b = b.replace('mentions: [moi],', 'mentions: [moi], sendBrut: true, avecChaine: true,')
fs.writeFileSync('lib/bienvenue.js', b)
console.log(b !== avantB ? '✅ test mis à jour' : '❌ bienvenue non modifié')
