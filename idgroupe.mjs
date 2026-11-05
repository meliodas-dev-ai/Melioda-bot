import fs from 'fs'
const f = 'lib/telegram.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(
  "  if (cmd === '/monid')",
  "  if (cmd === '/idgroupe') return envoyer(chat, `🆔 Identifiant de ce chat : <code>${chat}</code>`)\n  if (cmd === '/monid')"
)
if (s === avant) console.log('❌ rien modifié')
else { fs.writeFileSync(f, s); console.log('✅ /idgroupe ajouté') }
