import fs from 'fs'

// 1. Gestionnaire : limite sur les comptes connectés + rattachement + coupure des doublons
let g = fs.readFileSync('lib/gestionnaire.js', 'utf8')
if (!g.includes('coupée ici')) {
  // retire l'ancienne limite qui comptait aussi les codes en attente
  g = g.replace(/  if \(.*MAX_COMPTES.*\) throw new Error\('SATURE'\)\n/, '')
  // limite sur les comptes réellement connectés + refus si rattaché ailleurs
  g = g.replace('export async function demarrerAvecCode(numero) {\n', `export async function demarrerAvecCode(numero) {
  const connectes = [...sessions.values()].filter((s) => s.state.creds.registered).length
  if (connectes >= Number(process.env.MAX_COMPTES || 4)) throw new Error('SATURE')
  if (mongoActif()) {
    const a = await lireDoc(\`affect|\${numero}\`)
    if (a && String(a) !== MON_ID) throw new Error('AILLEURS')
  }
`)
  // coupure automatique si le numéro est rattaché à un autre serveur
  g = g.replace('      entree.connecte = true\n', `      if (mongoActif()) lireDoc(\`affect|\${numero}\`).then((a) => {
        if (a && String(a) !== MON_ID && sessions.get(numero) === entree) {
          console.log('✂️ Session coupée ici (rattachée à un autre serveur) :', numero)
          sessions.delete(numero)
          try { sock.end(undefined) } catch {}
        }
      }).catch(() => {})
      entree.connecte = true
`)
  fs.writeFileSync('lib/gestionnaire.js', g)
  console.log('✅ gestionnaire mis à jour')
} else console.log('✅ gestionnaire déjà à jour')

// 2. Serveur : messages d'erreur clairs
let s = fs.readFileSync('server.js', 'utf8')
if (!s.includes('AILLEURS')) {
  s = s.replace(
    "      SATURE: 'Le service est très sollicité. Réessaie dans quelques minutes.',",
    "      SATURE: 'Le service est très sollicité. Réessaie dans quelques minutes.',\n      AILLEURS: 'Ce numéro est déjà connecté sur un autre serveur. Déconnecte-le dans Appareils connectés, puis réessaie.',"
  )
  fs.writeFileSync('server.js', s)
  console.log('✅ message AILLEURS ajouté')
} else console.log('✅ message AILLEURS déjà présent')
