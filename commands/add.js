import { controleAdmin } from '../lib/groupe.js'

export default {
  nom: 'add',
  run: async ({ sock, jid, msg, args, config }) => {
    const meta = await controleAdmin(sock, msg, jid)
    if (!meta) return
    const envoyer = (text) => sock.sendMessage(jid, { text })
    const num = args.join('').replace(/\D/g, '')
    if (num.length < 8) {
      return envoyer(`Utilisation : ${config.prefix}add <numéro avec indicatif> (ex : ${config.prefix}add 243812345678)`)
    }
    const [existe] = await sock.onWhatsApp(num + '@s.whatsapp.net')
    if (!existe?.exists) return envoyer("⚠️ Ce numéro n'est pas sur WhatsApp.")
    const res = await sock.groupParticipantsUpdate(jid, [existe.jid], 'add')
    const statut = String(res?.[0]?.status)
    if (statut === '200') return envoyer('✅ Membre ajouté au groupe.')
    if (statut === '409') return envoyer('⚠️ Ce numéro est déjà dans le groupe.')
    if (statut === '408') return envoyer('⚠️ Cette personne a quitté le groupe récemment.')
    if (statut === '403') {
      try {
        const code = await sock.groupInviteCode(jid)
        await sock.sendMessage(existe.jid, {
          text: `Tu es invité(e) à rejoindre *${meta.subject}* : https://chat.whatsapp.com/${code}`,
        })
        return envoyer("📨 Ses paramètres de confidentialité bloquent l'ajout direct : une invitation lui a été envoyée en privé.")
      } catch {
        return envoyer('⚠️ Ajout impossible (paramètres de confidentialité).')
      }
    }
    return envoyer(`⚠️ Ajout impossible (code ${statut}).`)
  },
}
