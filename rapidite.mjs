import fs from 'fs'
const f = 'lib/gestionnaire.js'
let s = fs.readFileSync(f, 'utf8')
if (s.includes("sendPresenceUpdate('available')")) { console.log('✅ déjà en place'); process.exit(0) }
const a = s
s = s.replace(
  "      console.log('✅ Session connectée :', numero)",
  "      console.log('✅ Session connectée :', numero)\n      console.log('🕐 Prêt à', new Date().toLocaleTimeString('fr-FR'))\n      sock.sendPresenceUpdate('available').catch(() => {})"
)
s = s.replace(
  "  sock.ev.on('messages.upsert', async ({ messages }) => {\n    const msg = messages[0]",
  "  sock.ev.on('messages.upsert', async ({ messages, type }) => {\n    if (type !== 'notify') return\n    const msg = messages[0]"
)
if (s === a) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ changements appliqués') }
