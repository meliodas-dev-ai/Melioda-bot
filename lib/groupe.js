export const estGroupe = (jid) => jid.endsWith('@g.us')
export const estAdmin = (p) => p.admin === 'admin' || p.admin === 'superadmin'
export const jidDe = (p) => p.phoneNumber || p.id
export const numeroDe = (id) => id.split('@')[0].split(':')[0]

export function expediteurEstAdmin(sock, msg, meta) {
  const ids = [
    msg.key.participant,
    msg.key.participantAlt,
    msg.key.fromMe ? sock.user?.id : null,
    msg.key.fromMe ? sock.user?.lid : null,
  ].filter(Boolean).map(numeroDe)
  return meta.participants.some(
    (p) => estAdmin(p) && [p.id, p.phoneNumber, p.lid].filter(Boolean).map(numeroDe).some((n) => ids.includes(n))
  )
}

export function botEstAdmin(sock, meta) {
  const ids = [sock.user?.id, sock.user?.lid].filter(Boolean).map(numeroDe)
  return meta.participants.some(
    (p) => estAdmin(p) && [p.id, p.phoneNumber, p.lid].filter(Boolean).map(numeroDe).some((n) => ids.includes(n))
  )
}

export async function controleAdmin(sock, msg, jid) {
  if (!estGroupe(jid)) {
    await sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    return null
  }
  const meta = await sock.groupMetadata(jid)
  if (!expediteurEstAdmin(sock, msg, meta)) {
    await sock.sendMessage(jid, { text: '⛔ Commande réservée aux administrateurs du groupe.' })
    return null
  }
  if (!botEstAdmin(sock, meta)) {
    await sock.sendMessage(jid, { text: '⚠️ Le bot doit être administrateur du groupe pour faire ça.' })
    return null
  }
  return meta
}

export function cible(msg) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo
  return ctx?.mentionedJid?.[0] || ctx?.participant || null
}

export function trouverMembre(meta, id) {
  if (!id) return null
  const n = numeroDe(id)
  return (
    meta.participants.find((p) => [p.id, p.phoneNumber, p.lid].filter(Boolean).map(numeroDe).includes(n)) || null
  )
}

export async function controleBienvenue(sock, msg, jid) {
  if (!estGroupe(jid)) {
    await sock.sendMessage(jid, { text: '⚠️ Cette commande fonctionne uniquement dans un groupe.' })
    return null
  }
  const meta = await sock.groupMetadata(jid)
  if (!msg.key.fromMe && !expediteurEstAdmin(sock, msg, meta)) {
    await sock.sendMessage(jid, { text: '⛔ Commande réservée aux administrateurs du groupe et au propriétaire du bot.' })
    return null
  }
  return meta
}
