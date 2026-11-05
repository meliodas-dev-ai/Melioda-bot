import fs from 'fs'
const f = 'lib/telegram.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(
  "  if (cmd === '/actu') return actu(chat, m, texte)",
  "  if (cmd === '/actu') return actu(chat, m, texte)\n  if (['/planifier', '/planifies', '/annuler', '/quotidien'].includes(cmd)) return gererPlanification(chat, m, texte)"
)
s = s.replace("  let offset = 0", "  demarrerPlanification()\n  let offset = 0")
if (s === avant) console.log('❌ rien modifié')
else { fs.writeFileSync(f, s); console.log('✅ commandes et démarrage branchés') }
