import { cible, numeroDe, estGroupe, estAdmin, trouverMembre } from './groupe.js'

export const versJid = (id) => numeroDe(id) + '@s.whatsapp.net'

export function cibleOuMoi(sock, msg) {
  const id = cible(msg) || (msg.key.fromMe ? sock.user?.id : msg.key.participant || msg.key.remoteJid)
  return String(id).replace(/:\d+@/, '@')
}

export async function photo(sock, id) {
  for (const essai of [id, versJid(id)]) {
    try {
      const url = await sock.profilePictureUrl(essai, 'image')
      if (url) return url
    } catch {}
  }
  return null
}

export async function infos(sock, jid, id) {
  let numero = numeroDe(id)
  let role = null
  if (estGroupe(jid)) {
    const meta = await sock.groupMetadata(jid)
    const m = trouverMembre(meta, id)
    if (m) {
      numero = numeroDe(m.phoneNumber || m.id)
      role = m.admin === 'superadmin' ? 'Créateur' : estAdmin(m) ? 'Administrateur' : 'Membre'
    }
  }
  let bio = 'non disponible'
  try {
    const s = await sock.fetchStatus(versJid(id))
    const brut = Array.isArray(s) ? s[0]?.status : s?.status
    const texte = typeof brut === 'string' ? brut : brut?.status
    if (typeof texte === 'string' && texte) bio = texte
  } catch {}
  let t = `👤 Profil\n\n📱 Numéro : +${numero}\n💬 Statut : ${bio}`
  if (role) t += `\n🛡️ Rôle : ${role}`
  return t
}
