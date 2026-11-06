import fs from 'fs'
let g = fs.readFileSync('lib/gestionnaire.js', 'utf8')
if (!g.includes('nombreConnectes')) {
  g += "\nexport const nombreConnectes = () => [...sessions.values()].filter((s) => s.connecte).length\n"
  fs.writeFileSync('lib/gestionnaire.js', g)
}
let s = fs.readFileSync('server.js', 'utf8')
if (!s.includes('/api/stats')) {
  s = s.replace("estConnecte } from './lib/gestionnaire.js'", "estConnecte, nombreConnectes } from './lib/gestionnaire.js'")
  s = s.replace(
    "await chargerCommandes()",
    "app.get('/api/stats', (req, res) => {\n  if (!autorise('stats:' + req.ip, 30, 60 * 1000)) return res.status(429).json({})\n  res.json({ connectes: nombreConnectes(), max: Number(process.env.MAX_COMPTES || 50) })\n})\n\nawait chargerCommandes()"
  )
  fs.writeFileSync('server.js', s)
}
console.log(s.includes('/api/stats') && s.includes('nombreConnectes') ? '✅ compteur serveur ajouté' : '❌ à vérifier')
