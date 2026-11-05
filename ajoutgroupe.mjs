import fs from 'fs'
const f = 'lib/telegram.js'
let s = fs.readFileSync(f, 'utf8')
const avant = s
s = s.replace(
  "async function manquants(userId) {\n  const absents = []",
  "async function manquants(userId) {\n  const absents = []\n  if (process.env.TELEGRAM_OBLIGATOIRE_GROUPE === 'oui' && GROUPE) {\n    try {\n      const r = await appel('getChatMember', { chat_id: GROUPE, user_id: userId })\n      const ok = ROLES_OK.has(r.status) || (r.status === 'restricted' && r.is_member)\n      if (!ok) absents.push(GROUPE)\n    } catch (e) {\n      console.log('⚠️ Vérification impossible pour le groupe -', e.message)\n      throw new Error('VERIF')\n    }\n  }"
)
s = s.replace(
  "[{ text: '📢 Rejoindre la chaîne ' + (CANAUX.indexOf(c) + 1), url: 'https://t.me/' + c.slice(1) }]",
  "[{ text: '📢 Rejoindre la chaîne ' + (CANAUX.indexOf(c) + 1), url: 'https://t.me/' + c.slice(1) }]"
)
if (s === avant) console.log('❌ rien modifié, dis-le-moi')
else { fs.writeFileSync(f, s); console.log('✅ groupe obligatoire ajouté') }
