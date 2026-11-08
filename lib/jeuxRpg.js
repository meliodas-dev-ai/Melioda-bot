import { lire, ecrire } from './db.js'

export const objets = {
  potion: { nom: 'Potion', effet: 'soin', valeur: 5 },
  epee: { nom: 'Épée', effet: 'force', valeur: 15 },
  bouclier: { nom: 'Bouclier', effet: 'défense', valeur: 10 },
}

export function profil(id) {
  return lire(`rpg:${id}`, { niveau: 1, xp: 0, or: 0, objets: {}, dernierDaily: 0 })
}

export function sauver(id, p) {
  ecrire(`rpg:${id}`, p)
}

export function gagnerXp(p, quantite) {
  p.xp += quantite
  while (p.xp >= p.niveau * 100) {
    p.xp -= p.niveau * 100
    p.niveau++
  }
  return p
}
