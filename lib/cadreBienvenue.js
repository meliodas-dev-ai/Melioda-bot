import { lire } from './db.js'
import { police, policeItalique } from './police.js'
import { numeroDe } from './groupe.js'
import { signature } from './signature.js'

export function cadreBienvenue(type, jid, ids, meta, config) {
  const r = lire(`${type}:${jid}`, {})
  const titre = type === 'welcome' ? 'WELCOME' : 'GOODBYE'
  const mentions = ids.map((i) => '@' + numeroDe(i)).join(', ')
  const membres = meta.participants.length
  const admins = meta.participants.filter((p) => p.admin).length

  const lignes = r.texte
    ? r.texte
        .replaceAll('{membres}', mentions)
        .replaceAll('{groupe}', meta.subject)
        .split('\n')
        .map((l) => `│ ${l}`)
    : [
        `│ ◈ ${police(titre)}`,
        `│ ◈ ${police('GROUP')} : ${meta.subject}`,
        `│ ◈ ${police('USER')} : ${mentions}`,
        `│ ◈ ${police('MEMBERS')} : ${membres}`,
        `│ ◈ ${police('ADMINS')} : ${admins}`,
      ]

  return [
    `┌═══『 🤖 ${policeItalique('MELIODAS MD')} 』═══┐`,
    ...lignes,
    '└════════════════════┘',
    signature(),
  ].join('\n')
}
