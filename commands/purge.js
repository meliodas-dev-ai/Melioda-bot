import { controleAdmin, estAdmin } from '../lib/groupe.js'

const enCours = new Map()
const TAILLE_LOT = 20
const PAUSE_MS = 2000
const attendre = (ms) => new Promise((r) => setTimeout(r, ms))

export default {
  nom: 'purge',
  run: async ({ sock, jid, msg, args }) => {
    const meta0 = await controleAdmin(sock, msg, jid)
    if (!meta0) return
    const envoyer = (text) => sock.sendMessage(jid, { text }).catch(() => {})
    const etat = enCours.get(jid)

    if ((args[0] || '').toLowerCase() === 'stop') {
      if (!etat) return envoyer('Aucune purge en cours.')
      etat.stop = true
      return envoyer("🛑 Arrêt demandé : le lot en cours se termine, puis la purge s'arrête.")
    }
    if (etat) return envoyer("Une purge est déjà en cours. Tape .purge stop pour l'arrêter.")

    const total = meta0.participants.filter((p) => !estAdmin(p)).length
    if (!total) return envoyer('Aucun membre non-administrateur à retirer.')

    const nouvelEtat = { stop: false }
    enCours.set(jid, nouvelEtat)
    await envoyer(`🧹 Purge lancée : ${total} membre(s), par lots de ${TAILLE_LOT} toutes les ${PAUSE_MS / 1000} s.`)

    let retires = 0
    let erreurs = 0
    let zeros = 0
    let raison = null
    try {
      for (let passe = 0; passe < 3 && !nouvelEtat.stop && !raison; passe++) {
        const meta = await sock.groupMetadata(jid)
        const cibles = meta.participants.filter((p) => !estAdmin(p)).map((p) => p.id)
        if (!cibles.length) break
        for (let i = 0; i < cibles.length && !nouvelEtat.stop; i += TAILLE_LOT) {
          const lot = cibles.slice(i, i + TAILLE_LOT)
          let res
          try {
            res = await sock.groupParticipantsUpdate(jid, lot, 'remove')
          } catch (e) {
            erreurs++
            console.log('⚠️ Purge, lot refusé -', e.message)
            if (erreurs >= 3) {
              raison = e.message
              break
            }
            await attendre(10000)
            i -= TAILLE_LOT
            continue
          }
          erreurs = 0
          const ok = Array.isArray(res) ? res.filter((r) => String(r.status) === '200').length : lot.length
          retires += ok
          zeros = ok === 0 ? zeros + 1 : 0
          if (zeros >= 3) {
            raison = 'WhatsApp refuse de retirer les membres restants'
            break
          }
          await attendre(PAUSE_MS)
        }
      }
    } catch (e) {
      raison = e.message
      console.log('⚠️ Erreur purge -', e.message)
    }
    enCours.delete(jid)

    let restants = null
    try {
      const m = await sock.groupMetadata(jid)
      restants = m.participants.filter((p) => !estAdmin(p)).length
    } catch {}

    if (raison) return envoyer(`⚠️ Purge interrompue : ${raison}.\n${retires} membre(s) retiré(s)${restants === null ? '' : `, ${restants} restant(s)`}.`)
    if (nouvelEtat.stop) return envoyer(`🛑 Purge arrêtée : ${retires} membre(s) retiré(s)${restants === null ? '' : `, ${restants} restant(s)`}.`)
    if (restants === 0) return envoyer(`✅ Purge terminée : ${retires} membre(s) retiré(s). Il ne reste que les administrateurs.`)
    return envoyer(`✅ Purge terminée : ${retires} membre(s) retiré(s)${restants === null ? '' : `, ${restants} restant(s)`}.`)
  },
}
