import fs from 'fs'
const f = 'lib/telegram.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace('      return { url, connectes: r.connectes }', '      return { url, connectes: r.connectes, max: r.max || 3 }')
s = s.replace('  const dispo = etats.filter(Boolean).sort((a, b) => a.connectes - b.connectes)', '  const dispo = etats.filter((e) => e && e.connectes < e.max).sort((a, b) => a.connectes / a.max - b.connectes / b.max)')
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ Telegram tient compte de la capacité') }
