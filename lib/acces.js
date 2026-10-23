import { lire } from './db.js'
import { cible, numeroDe, estGroupe, trouverMembre } from './groupe.js'

export const estProprietaire = (msg) => msg.key.fromMe === true

export function verifierAcces(msg) {
  if (estProprietaire(msg)) return null
  if (lire('maintenance', {}).actif) return 'maintenance'
  if (lire('mode', {}).prive) return 'prive'
  const ids = [msg.key.participant, msg.key.participantAlt, msg.key.remoteJid]
    .filter(Boolean)
    .map(numeroDe)
  const bannis = lire('bannis', [])
  if (ids.some((n) => bannis.includes(n))) return 'banni'
  return null
}

export async function numerosCible(sock, jid, msg, args) {
  let id = cible(msg)
  const saisi = (args[0] || '').replace(/\D/g, '')
  if (!id && saisi.length >= 8) id = saisi + '@s.whatsapp.net'
  if (!id && !estGroupe(jid)) id = jid
  if (!id) return []
  const numeros = new Set([numeroDe(id)])
  if (estGroupe(jid)) {
    const meta = await sock.groupMetadata(jid)
    const m = trouverMembre(meta, id)
    if (m) for (const x of [m.id, m.phoneNumber, m.lid]) if (x) numeros.add(numeroDe(x))
  }
  return [...numeros]
}
