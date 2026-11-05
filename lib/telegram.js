import fs from 'fs'
import { demarrerAvecCode, estConnecte } from './gestionnaire.js'
import { lire, ecrire } from './db.js'
import { habiller } from './styleTelegram.js'

const TOKEN = process.env.TELEGRAM_TOKEN
const API = `https://api.telegram.org/bot${TOKEN}`
const CANAUX = (process.env.TELEGRAM_CANAUX || '').split(',').map((c) => c.trim()).filter((c) => /^@[A-Za-z0-9_]{4,}$/.test(c))
const GROUPE = (process.env.TELEGRAM_GROUPE || '').trim()
const ADMIN = String(process.env.TELEGRAM_ADMIN || '').trim()
const ANNONCE = process.env.TELEGRAM_ANNONCE_CONNEXION !== 'non'
const accepte = new Map()
const compteurs = new Map()

const attendre = (ms) => new Promise((r) => setTimeout(r, ms))
const nettoyer = (s) => String(s || '').replace(/[<>&]/g, '')

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

const CONDITIONS =
  '👋 <b>Connecter ton compte WhatsApp</b>\n\n' +
  'Avant de continuer, sache que :\n' +
  '• le bot répondra aux commandes depuis ton compte WhatsApp ;\n' +
  '• ton compte sera abonné à la chaîne MELIODAS ;\n' +
  (CANAUX.length ? '• tu dois rejoindre nos chaînes avant de recevoir ton code ;\n' : '') +
  '• WhatsApp peut restreindre les comptes qui utilisent des bots non officiels : tu en assumes le risque ;\n' +
  '• tu peux te déconnecter à tout moment (WhatsApp → Appareils connectés, ou .logout).\n\n' +
  "Si tu es d'accord, touche le bouton."

const ACCEPTER = { inline_keyboard: [[{ text: "✅ J'accepte", callback_data: 'accepte' }]] }
const MENU_CLAVIER = {
  inline_keyboard: [
    [{ text: '🔐 Connecter mon compte', callback_data: 'connecter' }],
    [{ text: '📢 Nos chaînes', callback_data: 'chaines' }, { text: '👥 Notre groupe', callback_data: 'groupe' }],
    [{ text: '📖 Commandes', callback_data: 'commandes' }, { text: '❓ Guide', callback_data: 'aide' }],
  ],
}
const TEXTE_MENU = '🤖 <b>MELIODAS BOT</b>\n\nChoisis une option ci-dessous.'
const GUIDE =
  '<b>Connecter ton compte en 5 étapes</b>\n' +
  "1. Touche « Connecter mon compte ».\n" +
  '2. Rejoins nos chaînes, puis touche « Vérifier ».\n' +
  "3. Envoie ton numéro avec l'indicatif, sans +.\n" +
  '4. Saisis le code dans WhatsApp : Appareils connectés → Connecter un appareil → Se connecter avec un numéro de téléphone.\n' +
  '5. Envoie <code>.menu</code> depuis ton compte WhatsApp.'
const COMMANDES =
  '<b>Commandes WhatsApp</b>\n' +
  'Tape <code>.menu</code> sur ton compte connecté : tu y trouves les sous-menus (groupe, jeux, outils, médias…).\n' +
  'Tape <code>.pair</code> pour recevoir les liens.'

const lienGroupe = () => process.env.TELEGRAM_GROUPE_LIEN || (GROUPE.startsWith('@') ? `https://t.me/${GROUPE.slice(1)}` : null)

function clavierLiens() {
  const lignes = CANAUX.map((c, i) => [{ text: `📢 Chaîne ${i + 1}`, url: `https://t.me/${c.slice(1)}` }])
  if (lienGroupe()) lignes.push([{ text: '👥 Rejoindre le groupe', url: lienGroupe() }])
  lignes.push([{ text: '⬅️ Menu', callback_data: 'menu' }])
  return { inline_keyboard: lignes }
}

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

const envoyer = (chat, texte, markup) =>
  appel('sendMessage', {
    chat_id: chat,
    text: habiller(texte),
    parse_mode: 'HTML',
    ...(markup ? { reply_markup: markup } : {}),
  }).catch((e) => console.log('⚠️ Telegram envoi -', e.message))

async function photo(chat, texte) {
  let buf = null
  try {
    buf = fs.readFileSync('assets/channel.jpg')
  } catch {}
  const corps = habiller(texte)
  if (!buf || corps.length > 800) {
    return appel('sendMessage', { chat_id: chat, text: corps, parse_mode: 'HTML' })
  }
  const f = new FormData()
  f.append('chat_id', String(chat))
  f.append('caption', corps)
  f.append('parse_mode', 'HTML')
  f.append('photo', new Blob([buf], { type: 'image/jpeg' }), 'channel.jpg')
  const rep = await fetch(`${API}/sendPhoto`, { method: 'POST', body: f })
  const json = await rep.json()
  if (!json.ok) throw new Error(json.description || 'Erreur Telegram')
  return json.result
}

const abonnes = () => lire('tg:abonnes', [])
function ajouterAbonne(chat) {
  const liste = abonnes()
  if (!liste.includes(chat)) ecrire('tg:abonnes', [...liste, chat])
}

async function diffuser(texte) {
  let n = 0
  for (const chat of abonnes()) {
    try {
      await photo(chat, texte)
      n++
    } catch (e) {
      console.log('⚠️ Diffusion -', e.message)
    }
    await attendre(80)
  }
  return n
}

async function publier(texte) {
  for (const cible of [...CANAUX, GROUPE].filter(Boolean)) {
    try {
      await photo(cible, texte)
    } catch (e) {
      console.log('⚠️ Publication', cible, '-', e.message)
    }
    await attendre(300)
  }
}

const ROLES_OK = new Set(['creator', 'administrator', 'member'])

async function manquants(userId) {
  const absents = []
  if (process.env.TELEGRAM_OBLIGATOIRE_GROUPE === 'oui' && GROUPE) {
    try {
      const r = await appel('getChatMember', { chat_id: GROUPE, user_id: userId })
      const ok = ROLES_OK.has(r.status) || (r.status === 'restricted' && r.is_member)
      if (!ok) absents.push(GROUPE)
    } catch (e) {
      console.log('⚠️ Vérification impossible pour le groupe -', e.message)
      throw new Error('VERIF')
    }
  }
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

const demanderAbonnements = (chat, liste = CANAUX, intro) =>
  envoyer(
    chat,
    intro || '📢 <b>Dernière étape</b>\n\nRejoins ces chaînes, puis touche « Vérifier ».',
    {
      inline_keyboard: [
        ...liste.map((c) => [{ text: '📢 Rejoindre la chaîne ' + (CANAUX.indexOf(c) + 1), url: 'https://t.me/' + c.slice(1) }]),
        [{ text: '✅ Vérifier', callback_data: 'verifier' }],
      ],
    }
  )

const demanderNumero = (chat) =>
  envoyer(chat, "✅ Merci. Envoie ton numéro WhatsApp avec l'indicatif, sans + ni espaces.\nExemple : <code>243812345678</code>")

function surveiller(chat, numero, mention) {
  let essais = 0
  const minuteur = setInterval(async () => {
    essais++
    if (estConnecte(numero)) {
      clearInterval(minuteur)
      await envoyer(chat, '✅ <b>Ton compte est connecté !</b>\n\nEnvoie <code>.menu</code> depuis ton compte WhatsApp.', MENU_CLAVIER)
      if (ANNONCE) publier(`🔔 <b>Nouvelle connexion</b>\nBienvenue à ${nettoyer(mention)} sur MELIODAS BOT !`).catch(() => {})
    } else if (essais > 100) {
      clearInterval(minuteur)
    }
  }, 3000)
}

async function traiterBouton(q) {
  const chat = q.message.chat.id
  await appel('answerCallbackQuery', { callback_query_id: q.id }).catch(() => {})
  switch (q.data) {
    case 'menu':
      return envoyer(chat, TEXTE_MENU, MENU_CLAVIER)
    case 'connecter':
      return envoyer(chat, CONDITIONS, ACCEPTER)
    case 'accepte':
      accepte.set(chat, Date.now())
      return CANAUX.length ? demanderAbonnements(chat) : demanderNumero(chat)
    case 'verifier': {
      if (!accepte.get(chat)) return envoyer(chat, 'Touche d’abord « Connecter mon compte ».', MENU_CLAVIER)
      try {
        const absents = await manquants(q.from.id)
        if (absents.length) return demanderAbonnements(chat, absents, `⚠️ Il te manque ${absents.length} chaîne(s) :`)
        return demanderNumero(chat)
      } catch {
        return envoyer(chat, 'Vérification impossible pour le moment. Réessaie dans quelques minutes.')
      }
    }
    case 'chaines':
      return envoyer(chat, '📢 <b>Nos chaînes</b>', clavierLiens())
    case 'groupe':
      return envoyer(chat, GROUPE ? '👥 <b>Notre groupe</b>' : 'Pas de groupe pour le moment.', clavierLiens())
    case 'commandes':
      return envoyer(chat, COMMANDES, MENU_CLAVIER)
    case 'aide':
      return envoyer(chat, GUIDE, MENU_CLAVIER)
  }
}

async function accueilGroupe(c) {
  if (!GROUPE) return
  const bon = String(c.chat.id) === GROUPE || '@' + c.chat.username === GROUPE
  if (!bon) return
  const avant = c.old_chat_member?.status
  const apres = c.new_chat_member?.status
  if (apres === 'member' && !['member', 'administrator', 'creator'].includes(avant)) {
    const u = c.new_chat_member.user
    const nom = u.username ? '@' + u.username : nettoyer(u.first_name)
    await photo(GROUPE, `👋 Bienvenue ${nom} dans le groupe MELIODAS !\nLis les règles, puis tape /menu en privé avec le bot.`)
  }
}

async function actu(chat, m, texte) {
  if (!ADMIN || String(m.from.id) !== ADMIN) return envoyer(chat, '⛔ Commande réservée à l’administrateur.')
  const contenu = texte.slice(5).trim()
  if (!contenu) return envoyer(chat, 'Utilisation : /actu ton message (il part avec la bannière)')
  const annonce = `📢 <b>ACTU MELIODAS</b>\n\n${contenu}`
  const n = await diffuser(annonce)
  await publier(annonce)
  return envoyer(chat, `✅ Actu envoyée à ${n} personne(s), et publiée dans les chaînes et le groupe.`)
}

async function traiter(u) {
  if (u.chat_member) return accueilGroupe(u.chat_member)
  if (u.callback_query) return traiterBouton(u.callback_query)

  const m = u.message
  if (!m?.text || m.chat.type !== 'private') return
  const chat = m.chat.id
  const texte = m.text.trim()
  const cmd = texte.split(/\s+/)[0].toLowerCase()
  ajouterAbonne(chat)

  if (cmd === '/start') return envoyer(chat, '👋 <b>Bienvenue sur MELIODAS BOT</b>\n\nCe bot te guide pour connecter ton compte WhatsApp.', MENU_CLAVIER)
  if (cmd === '/menu') return envoyer(chat, TEXTE_MENU, MENU_CLAVIER)
  if (cmd === '/aide') return envoyer(chat, GUIDE, MENU_CLAVIER)
  if (cmd === '/commandes') return envoyer(chat, COMMANDES, MENU_CLAVIER)
  if (cmd === '/chaines') return envoyer(chat, '📢 <b>Nos chaînes</b>', clavierLiens())
  if (cmd === '/groupe') return envoyer(chat, GROUPE ? '👥 <b>Notre groupe</b>' : 'Pas de groupe pour le moment.', clavierLiens())
  if (cmd === '/idgroupe') return envoyer(chat, `🆔 Identifiant de ce chat : <code>${chat}</code>`)
  if (cmd === '/monid') return envoyer(chat, `🆔 Ton identifiant : <code>${m.from.id}</code>`)
  if (cmd === '/actu') return actu(chat, m, texte)
  if (texte.startsWith('/')) return envoyer(chat, 'Commande inconnue. Tape /menu.', MENU_CLAVIER)

  const accord = accepte.get(chat)
  if (!accord || Date.now() - accord > 60 * 60 * 1000) {
    return envoyer(chat, 'Touche d’abord « Connecter mon compte » dans le menu.', MENU_CLAVIER)
  }
  if (CANAUX.length) {
    try {
      const absents = await manquants(m.from.id)
      if (absents.length) return demanderAbonnements(chat, absents, '⚠️ Tu dois rejoindre ces chaînes :')
    } catch {
      return envoyer(chat, 'Vérification impossible pour le moment. Réessaie dans quelques minutes.')
    }
  }

  const numero = texte.replace(/\D/g, '')
  if (!/^[1-9]\d{7,14}$/.test(numero)) {
    return envoyer(chat, "Numéro invalide. Envoie-le avec l'indicatif, sans + ni espaces.")
  }
  if (!autorise('tg:' + m.from.id, 3, 60 * 60 * 1000) || !autorise('num:' + numero, 3, 60 * 60 * 1000)) {
    return envoyer(chat, 'Trop de demandes. Réessaie plus tard.')
  }

  await envoyer(chat, '⏳ Génération du code…')
  try {
    const code = await demarrerAvecCode(numero)
    if (!code) throw new Error('PAS_DE_CODE')
    const joli = code.length === 8 ? code.slice(0, 4) + '-' + code.slice(4) : code
    await envoyer(chat, `🔑 Ton code : <code>${joli}</code>\n\nSaisis-le dans WhatsApp, puis attends la confirmation ici.`)
    surveiller(chat, numero, m.from.username ? '@' + m.from.username : m.from.first_name)
  } catch (e) {
    const messages = {
      DEJA_LIE: 'Ce numéro est déjà connecté au bot.',
      SATURE: 'Le service est très sollicité. Réessaie dans quelques minutes.',
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
  } catch (e) {
    return console.log('⚠️ Telegram -', e.message)
  }
  console.log(CANAUX.length ? `📢 Chaînes : ${CANAUX.join(', ')}` : 'ℹ️ Aucune chaîne obligatoire')
  console.log(GROUPE ? `👥 Groupe : ${GROUPE}` : 'ℹ️ Aucun groupe (TELEGRAM_GROUPE vide)')
  console.log(ADMIN ? '🛡️ Administrateur Telegram configuré' : 'ℹ️ TELEGRAM_ADMIN absent : /actu désactivé')
  let offset = 0
  while (true) {
    try {
      const majs = await appel('getUpdates', { offset, timeout: 25, allowed_updates: ['message', 'callback_query', 'chat_member'] })
      for (const u of majs) {
        offset = u.update_id + 1
        traiter(u).catch((e) => console.log('⚠️ Telegram -', e.message))
      }
    } catch (e) {
      console.log('⚠️ Telegram polling -', e.message)
      await attendre(5000)
    }
  }
}
