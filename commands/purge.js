import { controleAdmin, estAdmin } from '../lib/groupe.js'

const enCours = new Map()
const TAILLE_LOT = 20
const PAUSE_MS = 5000
const attendre = (ms) => new Promise((r) => setTimeout(r, ms))

export default {
  nom: 'purge',
  run: async ({ sock, jid, msg, args }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const envoyer = (text) => sock.sendMessage(jid, { text }).catch(() => {})
    const etat = enCours.get(jid)

    if ((args[0] || '').toLowerCase() === 'stop') {
      if (!etat) return envoyer('Aucune purge en cours.')
      etat.stop = true
      return envoyer("🛑 Arrêt demandé : le lot en cours se termine, puis la purge s'arrête.")
    }

    if (etat) return envoyer("Une purge est déjà en cours. Tape .purge stop pour l'arrêter.")

    const cibles = meta.participants.filter((p) => !estAdmin(p)).map((p) => p.id)
    if (!cibles.length) return envoyer('Aucun membre non-administrateur à retirer.')

    const nouvelEtat = { stop: false }
    enCours.set(jid, nouvelEtat)
    await envoyer(`🧹 Purge lancée : ${cibles.length} membre(s), par lots de ${TAILLE_LOT}, toutes les ${PAUSE_MS / 1000} s.`)

    let retires = 0
    let erreur = false
    try {
      for (let i = 0; i < cibles.length; i += TAILLE_LOT) {
        if (nouvelEtat.stop) break
        const lot = cibles.slice(i, i + TAILLE_LOT)
        await sock.groupParticipantsUpdate(jid, lot, 'remove')
        retires += lot.length
        if (i + TAILLE_LOT < cibles.length) await attendre(PAUSE_MS)
      }
    } catch (e) {
      erreur = true
      console.log('⚠️ Erreur purge -', e.message)
    }
    enCours.delete(jid)

    if (erreur) return envoyer(`⚠️ Purge interrompue par une erreur après ${retires} membre(s) retiré(s).`)
    if (nouvelEtat.stop) return envoyer(`🛑 Purge arrêtée : ${retires} membre(s) retiré(s).`)
    return envoyer(`✅ Purge terminée : ${retires} membre(s) retiré(s).`)
  },
}
