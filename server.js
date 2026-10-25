const filtre = (f) => (...a) => { const t = a.map(String).join(' '); if (/Closing session|Failed to decrypt|Session error|Bad MAC|MessageCounterError|SessionEntry/.test(t)) return; f(...a) }
console.info = filtre(console.info.bind(console))
console.warn = filtre(console.warn.bind(console))
console.error = filtre(console.error.bind(console))
import express from 'express'
import { chargerCommandes, restaurerSessions, demarrerAvecCode, estConnecte } from './lib/gestionnaire.js'

process.on('unhandledRejection', (e) => console.log('⚠️ Erreur non gérée -', e?.message))
process.on('uncaughtException', (e) => console.log('⚠️ Exception -', e?.message))

const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '2kb' }))
app.use(express.static('public'))

const compteurs = new Map()
function autorise(cle, max, fenetre) {
  const maintenant = Date.now()
  const liste = (compteurs.get(cle) || []).filter((t) => maintenant - t < fenetre)
  if (liste.length >= max) {
    compteurs.set(cle, liste)
    return false
  }
  liste.push(maintenant)
  compteurs.set(cle, liste)
  return true
}
setInterval(() => compteurs.clear(), 60 * 60 * 1000)

app.post('/api/code', async (req, res) => {
  const numero = String(req.body?.numero || '').replace(/\D/g, '')
  if (!/^[1-9]\d{7,14}$/.test(numero)) {
    return res.status(400).json({ erreur: 'Numéro invalide. Saisis-le avec l\'indicatif du pays, sans + ni espaces.' })
  }
  if (req.body?.consentement !== true) {
    return res.status(400).json({ erreur: 'Tu dois accepter les conditions pour continuer.' })
  }
  if (!autorise('ip:' + req.ip, 5, 10 * 60 * 1000) || !autorise('num:' + numero, 3, 60 * 60 * 1000)) {
    return res.status(429).json({ erreur: 'Trop de demandes. Réessaie plus tard.' })
  }
  try {
    const code = await demarrerAvecCode(numero)
    if (!code) throw new Error('PAS_DE_CODE')
    res.json({ code })
  } catch (e) {
    const messages = {
      DEJA_LIE: 'Ce numéro est déjà connecté au bot.',
      SATURE: 'Le service est très sollicité. Réessaie dans quelques minutes.',
    }
    console.log('⚠️ /api/code -', e.message)
    res.status(messages[e.message] ? 409 : 500).json({ erreur: messages[e.message] || 'Impossible de générer un code. Réessaie.' })
  }
})

app.get('/api/statut/:numero', (req, res) => {
  if (!autorise('st:' + req.ip, 120, 60 * 1000)) return res.status(429).json({})
  res.json({ connecte: estConnecte(String(req.params.numero).replace(/\D/g, '')) })
})

app.get('/healthz', (req, res) => res.send('ok'))
await chargerCommandes()
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`🌐 Site prêt : http://localhost:${port}`))
restaurerSessions()
