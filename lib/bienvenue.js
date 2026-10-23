import { controleAdmin, estGroupe, numeroDe } from './groupe.js'
import { lire, ecrire } from './db.js'

const defauts = {
  welcome: 'Bienvenue {membres} dans *{groupe}* !',
  goodbye: 'Au revoir {membres}.',
}

export function estActif(type, jid) {
  return lire(`${type}:${jid}`, {}).actif === true
}

export function messageFinal(type, jid, ids, nomGroupe, config) {
  const r = lire(`${type}:${jid}`, {})
  const modele = r.texte || defauts[type]
  const noms = ids.map((i) => '@' + numeroDe(i)).join(', ')
  return modele.replaceAll('{membres}', noms).replaceAll('{groupe}', nomGroupe) + `\n\n${config.signature}`
}

export function commandeActiver(type) {
  return {
    nom: type,
    run: async ({ sock, jid, msg, args, config }) => {
      const meta = await controleAdmin(sock, msg, jid)
      if (!meta) return
      const choix = (args[0] || '').toLowerCase()
      if (choix !== 'on' && choix !== 'off') {
        return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}${type} on/off` })
      }
      const cle = `${type}:${jid}`
      const r = lire(cle, {})
      r.actif = choix === 'on'
      ecrire(cle, r)
      const nom = type === 'welcome' ? 'bienvenue' : 'départ'
      await sock.sendMessage(jid, { text: `✅ Message de ${nom} ${choix === 'on' ? 'activé' : 'désactivé'}.` })
    },
  }
}

export function commandeTexte(type) {
  return {
    nom: 'set' + type,
    run: async ({ sock, jid, msg, args, config }) => {
      const meta = await controleAdmin(sock, msg, jid)
      if (!meta) return
      const texte = args.join(' ')
      if (!texte) {
        return sock.sendMessage(jid, {
          text: `Utilisation : ${config.prefix}set${type} <texte>\nVariables : {membres} et {groupe}`,
        })
      }
      const cle = `${type}:${jid}`
      const r = lire(cle, {})
      r.texte = texte
      ecrire(cle, r)
      await sock.sendMessage(jid, { text: '✅ Texte enregistré.' })
    },
  }
}

export function commandeTest(type) {
  return {
    nom: 'test' + type,
    run: async ({ sock, jid, msg, config }) => {
      const meta = await controleAdmin(sock, msg, jid)
      if (!meta) return
      const moi = numeroDe(msg.key.participant || sock.user?.id) + '@s.whatsapp.net'
      await sock.sendMessage(jid, {
        text: messageFinal(type, jid, [moi], meta.subject, config),
        mentions: [moi],
      })
    },
  }
}
