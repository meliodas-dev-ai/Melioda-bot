import fs from 'fs'

// 1. CORS dans server.js (la page centrale peut appeler les serveurs)
let s = fs.readFileSync('server.js', 'utf8')
if (!s.includes('Access-Control-Allow-Origin')) {
  const a = s
  s = s.replace("app.use(express.static('public'))", "app.use(express.static('public'))\napp.use((req, res, next) => {\n  res.setHeader('Access-Control-Allow-Origin', '*')\n  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')\n  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')\n  if (req.method === 'OPTIONS') return res.sendStatus(204)\n  next()\n})")
  console.log(s !== a ? '✅ CORS ajouté' : '❌ CORS : ancre introuvable')
} else console.log('✅ CORS déjà présent')

// 2. Serveur Telegram : ne relance pas les comptes WhatsApp
if (!s.includes('SERVEUR_TELEGRAM')) {
  const a = s
  s = s.replace(/^restaurerSessions\(\)$/m, "if (process.env.SERVEUR_TELEGRAM !== 'oui') restaurerSessions()")
  console.log(s !== a ? '✅ restauration conditionnelle ajoutée' : '❌ restaurerSessions introuvable')
} else console.log('✅ SERVEUR_TELEGRAM déjà présent')
fs.writeFileSync('server.js', s)

// 3. Telegram : code et connexion demandés aux serveurs WhatsApp
let t = fs.readFileSync('lib/telegram.js', 'utf8')
if (!t.includes('codeDistant')) {
  const bloc = `
const SERVEURS_WA = (process.env.SERVEURS_WA || '').split(',').map((u) => u.trim()).filter(Boolean)
const urlDuNumero = new Map()

async function choisirServeurWa() {
  const etats = await Promise.all(SERVEURS_WA.map(async (url) => {
    try {
      const r = await (await fetch(url + '/api/stats', { signal: AbortSignal.timeout(5000) })).json()
      return { url, connectes: r.connectes }
    } catch { return null }
  }))
  const dispo = etats.filter(Boolean).sort((a, b) => a.connectes - b.connectes)
  return dispo[0] ? dispo[0].url : null
}

async function codeDistant(numero) {
  const url = await choisirServeurWa()
  if (!url) throw new Error('SATURE')
  const r = await fetch(url + '/api/code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numero, consentement: true }),
  })
  const j = await r.json()
  if (!r.ok) {
    if (String(j.erreur).includes('déjà')) throw new Error('DEJA_LIE')
    if (String(j.erreur).includes('sollicité')) throw new Error('SATURE')
    throw new Error('ERREUR')
  }
  urlDuNumero.set(numero, url)
  return { code: j.code, url }
}

async function connecteDistant(numero) {
  const url = urlDuNumero.get(numero)
  if (!url) return false
  try {
    const r = await (await fetch(url + '/api/statut/' + numero, { signal: AbortSignal.timeout(5000) })).json()
    return r.connecte === true
  } catch { return false }
}
`
  const a = t
  t = t.replace('const accepte = new Map()', bloc + '\nconst accepte = new Map()')
  t = t.replace('    const code = await demarrerAvecCode(numero)', '    const { code } = await codeDistant(numero)')
  t = t.replace('    if (estConnecte(numero)) {', '    if (await connecteDistant(numero)) {')
  console.log(t !== a ? '✅ Telegram en mode distant' : '❌ Telegram : une ancre est introuvable, dis-le-moi')
  fs.writeFileSync('lib/telegram.js', t)
} else console.log('✅ Telegram déjà en mode distant')
