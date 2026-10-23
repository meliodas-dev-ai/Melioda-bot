import config from '../config.js'
import { lire, ecrire } from './db.js'
import { numeroDe } from './groupe.js'

export const chaine = { jid: null, nom: null }

async function suivre(sock, jid) {
  const cle = `suivi:${numeroDe(sock.user?.id || '')}`
  const deja = lire(cle, [])
  if (deja.includes(jid)) return
  try {
    await sock.newsletterFollow(jid)
    ecrire(cle, [...deja, jid])
    console.log('✅ Abonné à la chaîne')
  } catch (e) {
    console.log('⚠️ Abonnement impossible -', e.message)
  }
}

export async function chargerChaine(sock) {
  try {
    const code = config.chaine.split('/channel/')[1]
    console.log('🔎 Recherche de la chaîne…', code)
    const meta = await Promise.race([
      sock.newsletterMetadata('invite', code),
      new Promise((_, rejeter) => setTimeout(() => rejeter(new Error('délai dépassé')), 20000)),
    ])
    chaine.jid = meta.id
    chaine.nom = meta.name || config.nomBot
    console.log('📢 Chaîne trouvée :', chaine.nom, chaine.jid)
    await suivre(sock, chaine.jid)
    return true
  } catch (e) {
    console.log('⚠️ Chaîne introuvable -', e.message)
    return false
  }
}
