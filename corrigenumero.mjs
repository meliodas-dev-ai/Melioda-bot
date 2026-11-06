import fs from 'fs'
const f = 'public/index.html'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace("  let minuteur = null\n", "  let minuteur = null\n  function complet(brut) {\n    let d = brut.replace(/\\D/g, '')\n    if (d.startsWith('243')) return d\n    return '243' + d.replace(/^0+/, '')\n  }\n")
s = s.replace("const n = numero.value.replace(/\\D/g, '')", "const n = complet(numero.value)")
s = s.split("'/api/statut/243' + n.replace(/^243/, '')").join("'/api/statut/' + n")
s = s.split("'243' + n.replace(/^243/, '')").join("n")
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ numéro corrigé') }
