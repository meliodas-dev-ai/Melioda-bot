import fs from 'fs'
const f = 'lib/autostyle.js'
let s = fs.readFileSync(f, 'utf8')
if (s.includes('sendBrut')) { console.log('✅ déjà corrigé'); process.exit(0) }
s = s.replace(
  "    await sock.sendMessage(jid, { text: nouveau, edit: msg.key })",
  "    await sock.sendMessage(jid, { text: nouveau, edit: msg.key, sendBrut: true })"
)
fs.writeFileSync(f, s)
console.log(s.includes('sendBrut') ? '✅ drapeau ajouté' : '❌ à vérifier')
