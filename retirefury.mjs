import fs from 'fs'
import path from 'path'
const fichiers = [
  ...fs.readdirSync('lib').filter((f) => f.endsWith('.js')).map((f) => path.join('lib', f)),
  ...fs.readdirSync('commands').filter((f) => f.endsWith('.js')).map((f) => path.join('commands', f)),
  'config.js', 'server.js', 'index.js',
]
let modifies = 0
for (const f of fichiers) {
  if (!fs.existsSync(f)) continue
  const avant = fs.readFileSync(f, 'utf8')
  let s = avant
    .split('\n')
    .filter((l) => !l.includes("police('BLACK FURY SYSTEM')"))
    .join('\n')
  s = s.replace(/┗━*『 \$\{police\('BLACK FURY'\)\} 』━*┛/g, '┗━━━━━━━━━━━━━━━━━━━━━┛')
  s = s.replace(/POWERED BY MELIODAS BLACK FURY/g, 'POWERED BY MELIODAS DEV')
  if (s !== avant) { fs.writeFileSync(f, s); modifies++; console.log('✅', f) }
}
console.log(`Fichiers modifiés : ${modifies}`)
