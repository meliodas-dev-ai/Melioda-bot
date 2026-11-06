import fs from 'fs'
const f = 'public/index.html'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(
  `    <label class="accord"><input id="accord" type="checkbox"><span>J'ai compris et j'accepte ces conditions.</span></label>`,
  `    <p class="sous">En cliquant sur le bouton, tu acceptes ces conditions.</p>`
)
s = s.replace(`  const accord = document.getElementById('accord')\n`, '')
s = s.replace('consentement: accord.checked', 'consentement: true')
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ case retirée') }
