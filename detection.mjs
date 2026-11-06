import fs from 'fs'
const f = 'public/index.html'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(
  '<div class="pastille"><span class="point"></span> En ligne</div>',
  '<div class="pastille"><span class="point"></span><span id="hautTxt">En ligne</span></div>'
)
s = s.replace(/  function complet\(\) \{[\s\S]*?  majApercu\(\)\n/, () => `  function detecter(d) {
    let t = null
    for (const p of PAYS) if (d.startsWith(p[2]) && (!t || p[2].length > t[2].length)) t = p
    return t
  }

  function saisie() {
    let d = numero.value.replace(/\\D/g, '')
    if (d.startsWith('00')) d = d.slice(2)
    return d
  }

  function complet() {
    const code = pays.value
    const d = saisie()
    if (d.startsWith(code)) return d
    return code + d.replace(/^0+/, '')
  }

  function majApercu(detect = false) {
    const d = saisie()
    const t = detecter(d)
    if (detect && t && d.length >= t[2].length && pays.value !== t[2]) pays.value = t[2]
    const n = complet()
    const p = PAYS.find(x => x[2] === pays.value)
    document.getElementById('hautTxt').textContent = p ? p[0] + ' ' + p[1] + ' · +' + p[2] : 'En ligne'
    apercu.innerHTML = n.length > 3 ? 'Numéro complet : <b>+' + n + '</b>' : ''
  }
  pays.addEventListener('change', () => majApercu(false))
  numero.addEventListener('input', () => majApercu(true))
  majApercu(false)
`)
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ détection par indicatif ajoutée') }
