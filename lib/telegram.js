import { habiller } from './styleTelegram.js'
import { demarrerAvecCode, estConnecte } from './gestionnaire.js'

const TOKEN = process.env.TELEGRAM_TOKEN
const API = `https://api.telegram.org/bot${TOKEN}`
const CANAUX = (process.env.TELEGRAM_CANAUX || '')
  .split(',')
  .map((c) => c.trim())
  .filter((c) => /^@[A-Za-z0-9_]{4,}$/.test(c))
const accepte = new Map()
const compteurs = new Map()

const CONDITIONS =
  '👋 <b>Bienvenue sur MELIODAS BOT</b>\n\n' +
  'Ce service connecte ton compte WhatsApp au bot grâce à un code.\n\n' +
  '<b>Avant de continuer, tu dois savoir que :</b>\n' +
  '• le bot répondra aux commandes depuis ton compte WhatsApp ;\n' +
  '• ton compte sera abonné à la chaîne MELIODAS ;\n' +
  '• les réglages de tes groupes sont enregistrés sur le serveur ;\n' +
  (CANAUX.length ? '• tu dois rejoindre nos chaînes Telegram avant de recevoir ton code (vérifié automatiquement) ;\n' : '') +
  '• WhatsApp peut restreindre les comptes qui utilisent des bots non officiels : tu en assumes le risque ;\n' +
  '• tu peux te déconnecter à tout moment (WhatsApp → Appareils connectés, ou la commande .logout).\n\n' +
  "Si tu es d'accord, touche le bouton ci-dessous."

function autorise(cle, max, fenetre) {
  const maintenant = Date.now()
  const liste = (compteurs.get(cle) || []).filter((t) => maintenant - t < fenetre)
  if (liste.length >= max) {
    compteurs.set(cle, liste)
    return false
  }
  liste.push(maintenant)
  compteurs.set(cle, liste)
  return true
}
setInterval(() => compteurs.clear(), 60 * 60 * 1000)

async function appel(methode, corps = {}) {
  const rep = await fetch(`${API}/${methode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
  })
  const json = await rep.json()
  if (!json.ok) throw new Error(json.description || 'Erreur Telegram')
  return json.result
}

const envoyer = (chat_id, text, extra = {}) =>
  appel('sendMessage', { chat_id, text: habiller(text), parse_mode: 'HTML', ...extra }).catch((e) =>
    console.log('⚠️ Telegram envoi -', e.message)
  )

function surveiller(chat, numero) {
  let essais = 0
  const minuteur = setInterval(() => {
    essais++
    if (estConnecte(numero)) {
      clearInterval(minuteur)
      envoyer(chat, '✅ <b>Bot connecté !</b> Envoie .menu depuis ton compte WhatsApp.')
    } else if (essais > 100) {
      clearInterval(minuteur)
    }
  }, 3000)
}

const ROLES_OK = new Set(['creator', 'administrator', 'member'])

async function manquants(userId) {
  const absents = []
  for (const canal of CANAUX) {
    try {
      const r = await appel('getChatMember', { chat_id: canal, user_id: userId })
      const ok = ROLES_OK.has(r.status) || (r.status === 'restricted' && r.is_member)
      if (!ok) absents.push(canal)
    } catch (e) {
      console.log('⚠️ Vérification impossible pour', canal, '-', e.message)
      throw new Error('VERIF')
    }
  }
  return absents
}

const boutonsCanaux = (liste) => ({
  inline_keyboard: [
    ...liste.map((c) => [{ text: '📢 Rejoindre ' + c, url: 'https://t.me/' + c.slice(1) }]),
    [{ text: "✅ J'ai rejoint, vérifier", callback_data: 'verifier' }],
  ],
})

const demanderAbonnements = (chat, liste = CANAUX, intro) =>
  envoyer(
    chat,
    intro || "📢 <b>Dernière étape avant ton code</b>\n\nRejoins ces chaînes, puis touche « J'ai rejoint, vérifier ».",
    { reply_markup: boutonsCanaux(liste) }
  )

const demanderNumero = (chat) =>
  envoyer(
    chat,
    "✅ Merci. Envoie maintenant ton numéro WhatsApp avec l'indicatif du pays, sans + ni espaces.\nExemple : <code>243812345678</code>"
  )

async function traiter(u) {
  if (u.callback_query) {
    const q = u.callback_query
    const chat = q.message.chat.id
    await appel('answerCallbackQuery', { callback_query_id: q.id }).catch(() => {})
    if (q.data === 'accepte') {
      accepte.set(chat, Date.now())
      return CANAUX.length ? demanderAbonnements(chat) : demanderNumero(chat)
    }
    if (q.data === 'verifier') {
      if (!accepte.get(chat)) return envoyer(chat, 'Commence par /start.')
      try {
        const absents = await manquants(q.from.id)
        if (absents.length) {
          return demanderAbonnements(chat, absents, `⚠️ Il te manque ${absents.length} chaîne(s) :`)
        }
        return demanderNumero(chat)
      } catch {
        return envoyer(chat, 'Vérification impossible pour le moment. Réessaie dans quelques minutes.')
      }
    }
    return
  }

  const m = u.message
  if (!m?.text || m.chat.type !== 'private') return
  const chat = m.chat.id
  const texte = m.text.trim()

  if (texte.startsWith('/start')) {
    return envoyer(chat, CONDITIONS, {
      reply_markup: { inline_keyboard: [[{ text: "✅ J'accepte", callback_data: 'accepte' }]] },
    })
  }
  if (texte.startsWith('/aide')) {
    return envoyer(
      chat,
      "📖 <b>Aide</b>\n\n1. /start puis « J'accepte »\n2. Rejoins les chaînes demandées et touche « Vérifier »\n3. Envoie ton numéro avec l'indicatif\n4. Saisis le code dans WhatsApp : Appareils connectés → Connecter un appareil → Se connecter avec un numéro de téléphone"
    )
  }
  if (texte.startsWith('/deconnexion')) {
    return envoyer(
      chat,
      '👋 Pour te déconnecter : dans WhatsApp, ouvre <b>Appareils connectés</b>, choisis le bot, puis <b>Se déconnecter</b>. Tu peux aussi envoyer <code>.logout</code> depuis ton compte.'
    )
  }
  if (texte.startsWith('/')) return

  const accord = accepte.get(chat)
  if (!accord || Date.now() - accord > 60 * 60 * 1000) {
    return envoyer(chat, 'Commence par /start et accepte les conditions.')
  }

  if (CANAUX.length) {
    try {
      const absents = await manquants(m.from.id)
      if (absents.length) {
        return demanderAbonnements(chat, absents, '⚠️ Tu dois rejoindre ces chaînes pour continuer :')
      }
    } catch {
      return envoyer(chat, 'Vérification impossible pour le moment. Réessaie dans quelques minutes.')
    }
  }

  const numero = texte.replace(/\D/g, '')
  if (!/^[1-9]\d{7,14}$/.test(numero)) {
    return envoyer(chat, "Numéro invalide. Envoie-le avec l'indicatif du pays, sans + ni espaces.")
  }
  if (!autorise('tg:' + m.from.id, 3, 60 * 60 * 1000) || !autorise('num:' + numero, 3, 60 * 60 * 1000)) {
    return envoyer(chat, 'Trop de demandes. Réessaie plus tard.')
  }

  await envoyer(chat, '⏳ Génération du code…')
  try {
    const code = await demarrerAvecCode(numero)
    if (!code) throw new Error('PAS_DE_CODE')
    const joli = code.length === 8 ? code.slice(0, 4) + '-' + code.slice(4) : code
    await envoyer(
      chat,
      `🔑 Ton code : <code>${joli}</code>\n\nDans WhatsApp : <b>Appareils connectés</b> → <b>Connecter un appareil</b> → <b>Se connecter avec un numéro de téléphone</b>, puis saisis ce code.`
    )
    surveiller(chat, numero)
  } catch (e) {
    const messages = {
      DEJA_LIE: 'Ce numéro est déjà connecté au bot.',
      SATURE: 'Le service est très sollicité.' + (process.env.LIEN_SECOURS ? ' Essaie plutôt ce serveur : ' + process.env.LIEN_SECOURS : ' Réessaie dans quelques minutes.'),
    }
    console.log('⚠️ Telegram code -', e.message)
    await envoyer(chat, messages[e.message] || 'Impossible de générer un code. Réessaie.')
  }
}

export async function demarrerTelegram() {
  if (!TOKEN) return console.log('ℹ️ Telegram désactivé (pas de TELEGRAM_TOKEN)')
  try {
    const moi = await appel('getMe')
    console.log('🤖 Bot Telegram actif : @' + moi.username)
    console.log(
      CANAUX.length ? `📢 Chaînes à rejoindre : ${CANAUX.join(', ')}` : 'ℹ️ Aucune chaîne obligatoire (TELEGRAM_CANAUX vide)'
    )
  } catch (e) {
    return console.log('⚠️ Telegram -', e.message)
  }
  let offset = 0
  while (true) {
    try {
      const majs = await appel('getUpdates', { offset, timeout: 25, allowed_updates: ['message', 'callback_query'] })
      for (const u of majs) {
        offset = u.update_id + 1
        traiter(u).catch((e) => console.log('⚠️ Telegram -', e.message))
      }
    } catch (e) {
      console.log('⚠️ Telegram polling -', e.message)
      await new Promise((r) => setTimeout(r, 5000))
    }
  }
}
