import { lire } from './db.js'
import { styles, convertir } from './stylesTexte.js'
import config from '../config.js'

const traites = new Set()
const PRESERVER = /(https?:\/\/\S+|@\d+)/

export function styliserTexte(texte, index) {
  const style = styles[index] || styles[0]
  return texte
    .split(PRESERVER)
    .map((m, i) => (i % 2 === 1 ? m : convertir(m, style)))
    .join('')
}

export async function autostyle(sock, msg) {
  if (!msg?.message || !msg.key?.fromMe) return
  const jid = msg.key.remoteJid
  if (!jid || jid === 'status@broadcast') return
  if (traites.has(msg.key.id)) return
  const r = lire('autostyle', null)
  if (!r?.actif) return
  const texte = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
  if (!texte || texte.length > 1000) return
  const t = texte.trim()
  if (t.startsWith(config.prefix)) return
  if (/[┏┃┗╔║╚╭╰]/.test(t)) return
  traites.add(msg.key.id)
  if (traites.size > 5000) traites.clear()
  const nouveau = styliserTexte(texte, r.index ?? 0)
  if (nouveau === texte) return
  try {
    await sock.sendMessage(jid, { text: nouveau, edit: msg.key })
  } catch (e) {
    console.log('⚠️ Écriture automatique -', e.message)
  }
}
