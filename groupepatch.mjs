import fs from 'fs'
let e = fs.readFileSync('lib/evenements.js', 'utf8')
if (!e.includes('protegerMentions')) {
  e = e.replace("import { modererMots } from './badwords.js'", "import { modererMots } from './badwords.js'\nimport { protegerMentions, protegerArrivees } from './protections.js'")
  e = e.replace("        await modererMots(sock, m)\n", "        await modererMots(sock, m)\n        await protegerMentions(sock, m)\n")
  e = e.replace("  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {\n", "  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {\n    await protegerArrivees(sock, id, participants, action).catch(() => {})\n")
  fs.writeFileSync('lib/evenements.js', e)
  console.log('✅ protections branchées')
} else console.log('✅ déjà branché')

let b = fs.readFileSync('lib/bienvenue.js', 'utf8')
if (!b.includes('ghostmode:')) {
  b = b.replace("export function estActif(type, jid) {\n", "export function estActif(type, jid) {\n  if (lire(`ghostmode:${jid}`, {}).actif) return false\n")
  fs.writeFileSync('lib/bienvenue.js', b)
  console.log('✅ mode silencieux branché')
} else console.log('✅ mode silencieux déjà branché')
