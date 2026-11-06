import fs from 'fs'
const fichiers = ['lib/style.js', 'lib/styleTelegram.js', 'lib/accueilConnexion.js']
for (const f of fichiers) {
  if (!fs.existsSync(f)) { console.log('⏭️ absent :', f); continue }
  let s = fs.readFileSync(f, 'utf8')
  const avant = s
  s = s.replace(/import \{ police \} from '\.\/police\.js'/, "import { police, policeItalique } from './police.js'")
  s = s.split("police(config.nomBot)").join("policeItalique('MELIODAS MD')")
  s = s.split("police('MELIODAS BOT')").join("policeItalique('MELIODAS MD')")
  if (s === avant) console.log('➖ rien à changer :', f)
  else { fs.writeFileSync(f, s); console.log('✅ marque changée :', f) }
}
