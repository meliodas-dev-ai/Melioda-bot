import { controleAdmin } from '../lib/groupe.js'
import { lire, ecrire } from '../lib/db.js'

export default {
  nom: 'antibadword',
  run: async ({ sock, jid, msg, args, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const envoyer = (text) => sock.sendMessage(jid, { text })
    const cle = `antibadword:${jid}`
    const r = lire(cle, {})
    r.mots = r.mots || []
    const sous = (args[0] || '').toLowerCase()
    const p = config.prefix

    if (sous === 'on' || sous === 'off') {
      r.actif = sous === 'on'
      ecrire(cle, r)
      let t = `✅ Filtre de mots ${r.actif ? 'activé' : 'désactivé'}.`
      if (r.actif && !r.mots.length) t += `\nAjoute des mots avec ${p}antibadword add <mot>`
      return envoyer(t)
    }

    if (sous === 'add') {
      const mot = (args[1] || '').toLowerCase()
      if (!mot) return envoyer(`Utilisation : ${p}antibadword add <mot>`)
      if (r.mots.includes(mot)) return envoyer('⚠️ Ce mot est déjà dans la liste.')
      r.mots.push(mot)
      ecrire(cle, r)
      return envoyer('✅ Mot ajouté.')
    }

    if (sous === 'del') {
      const mot = (args[1] || '').toLowerCase()
      if (!r.mots.includes(mot)) return envoyer("⚠️ Ce mot n'est pas dans la liste.")
      r.mots = r.mots.filter((m) => m !== mot)
      ecrire(cle, r)
      return envoyer('✅ Mot retiré.')
    }

    if (sous === 'list') {
      return envoyer(r.mots.length ? '📋 Mots filtrés :\n' + r.mots.map((m) => '• ' + m).join('\n') : 'Aucun mot dans la liste.')
    }

    return envoyer(`Utilisation : ${p}antibadword on/off | add <mot> | del <mot> | list`)
  },
}
