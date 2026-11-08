import fs from 'fs'
const f = 'lib/gestionnaire.js'
let s = fs.readFileSync(f, 'utf8')
if (s.includes('Session WhatsApp ignorée sur le serveur Telegram')) { console.log('✅ garde déjà présente'); process.exit(0) }
const avant = s
s = s.replace(
  "async function demarrer(numero, avecCode = false) {",
  "async function demarrer(numero, avecCode = false) {\n  if (process.env.SERVEUR_TELEGRAM === 'oui') {\n    console.log('⛔ Session WhatsApp ignorée sur le serveur Telegram :', numero)\n    return null\n  }"
)
if (s === avant) console.log('❌ fonction demarrer introuvable, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ garde ajoutée') }
