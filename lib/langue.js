import { lire } from './db.js'

const TABLE = [
  ['⛔ Commande réservée au propriétaire du bot.', '⛔ This command is reserved for the bot owner.'],
  ['⛔ Commande réservée aux administrateurs du groupe.', '⛔ This command is reserved for group admins.'],
  ['⚠️ Cette commande fonctionne uniquement dans un groupe.', '⚠️ This command only works in a group.'],
  ['Utilisation :', 'Usage:'],
  ['⚠️ Une erreur est survenue avec cette commande.', '⚠️ An error occurred with this command.'],
  ['🛠️ Le bot est en maintenance. Réessaie plus tard.', '🛠️ The bot is under maintenance. Try again later.'],
  ['Recherche impossible pour le moment.', 'Search is unavailable right now.'],
  ['Réessaie plus tard.', 'Try again later.'],
  ['Aucune règle définie.', 'No rules set.'],
  ['Pas de description pour le moment.', 'No description yet.'],
  ['Aucun membre non-administrateur à retirer.', 'No non-admin members to remove.'],
  ['✅ Membre ajouté au groupe.', '✅ Member added to the group.'],
  ['✅ Membre retiré du groupe.', '✅ Member removed from the group.'],
  ['🔓 Le groupe est ouvert : tout le monde peut écrire.', '🔓 The group is open: everyone can write.'],
  ['🔒 Le groupe est fermé : seuls les admins peuvent écrire.', '🔒 The group is closed: only admins can write.'],
  ['Lien du groupe :', 'Group link:'],
  ['Le saviez-vous ?', 'Did you know?'],
  ['Bonne réponse !', 'Correct answer!'],
  ['Aucun quiz en cours.', 'No quiz in progress.'],
  ['Pour voir les commandes', 'to see the commands'],
  ['Vérité', 'Truth'],
  ['Défi', 'Challenge'],
  ['Énigme', 'Riddle'],
  ['Membres :', 'Members:'],
  ['Administrateurs :', 'Admins:'],
]

const TRI = [...TABLE].sort((a, b) => b[0].length - a[0].length)

export function traduireTexte(t) {
  let s = t
  for (const [fr, en] of TRI) s = s.split(fr).join(en)
  return s
}

export function traduire(jid, contenu) {
  if (!contenu || contenu.delete) return contenu
  let langue = 'fr'
  try {
    langue = lire(`langue:${jid}`, 'fr')
  } catch {}
  if (langue !== 'en') return contenu
  const c = { ...contenu }
  if (typeof c.text === 'string') c.text = traduireTexte(c.text)
  if (typeof c.caption === 'string') c.caption = traduireTexte(c.caption)
  return c
}
