import fs from 'fs'
const f = 'lib/telegram.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(
  "  if (!m?.text || m.chat.type !== 'private') return",
  "  if (m?.text?.trim().startsWith('/idgroupe')) return envoyer(m.chat.id, `🆔 Identifiant de ce chat : <code>${m.chat.id}</code>`)\n  if (!m?.text || m.chat.type !== 'private') return"
)
if (s === avant) console.log('❌ rien modifié')
else { fs.writeFileSync(f, s); console.log('✅ /idgroupe actif dans les groupes') }
