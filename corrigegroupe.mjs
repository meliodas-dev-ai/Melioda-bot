import fs from 'fs'
const f = 'lib/telegram.js'
let s = fs.readFileSync(f, 'utf8')
s = s.replace(/  if \(process\.env\.TELEGRAM_OBLIGATOIRE_GROUPE === 'oui' && GROUPE\) \{[\s\S]*?\n  \}\n/, '')
if (!s.includes('const obligatoires')) {
  s = s.replace(
    "const ROLES_OK = new Set(['creator', 'administrator', 'member'])",
    "const ROLES_OK = new Set(['creator', 'administrator', 'member'])\nconst obligatoires = () => [...CANAUX, ...(process.env.TELEGRAM_OBLIGATOIRE_GROUPE === 'oui' && GROUPE ? [GROUPE] : [])]"
  )
}
s = s.replace('for (const canal of CANAUX) {', 'for (const canal of obligatoires()) {')
s = s.replace(
  /\.\.\.liste\.map\(\(c\) => \[\{ text: [^\n]*\}\]\),/,
  "...liste.map((c) => [c === GROUPE ? { text: '👥 Rejoindre le groupe', url: process.env.TELEGRAM_GROUPE_LIEN || lienGroupe() || 'https://t.me/' } : { text: '📢 Rejoindre la chaîne ' + (CANAUX.indexOf(c) + 1), url: 'https://t.me/' + c.slice(1) }]),"
)
s = s.replace(
  "return CANAUX.length ? demanderAbonnements(chat) : demanderNumero(chat)",
  "return obligatoires().length ? demanderAbonnements(chat, obligatoires()) : demanderNumero(chat)"
)
s = s.replace(
  "  if (CANAUX.length) {\n    try {\n      const absents = await manquants(m.from.id)",
  "  if (obligatoires().length) {\n    try {\n      const absents = await manquants(m.from.id)"
)
fs.writeFileSync(f, s)
console.log(s.includes('obligatoires()') ? '✅ groupe obligatoire corrigé' : '❌ à vérifier')
