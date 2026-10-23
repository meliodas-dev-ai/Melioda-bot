import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import pino from 'pino'
import readline from 'readline'

const PREFIX = '!'

const commandes = {
  ping: async (sock, jid) => {
    await sock.sendMessage(jid, { text: 'pong 🏓' })
  },
}

function demander(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl.question(question, (rep) => { rl.close(); resolve(rep.trim()) })
  })
}

async function demarrer() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const { version } = await fetchLatestBaileysVersion()

  let numero = null
  if (!state.creds.registered) {
    numero = (await demander('Ton numéro (ex: 243841466086) : ')).replace(/\D/g, '')
  }

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
  })

  if (numero) {
    await new Promise((r) => setTimeout(r, 3000))
    const code = await sock.requestPairingCode(numero)
    console.log('Code de jumelage :', code)
  }

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') console.log('✅ Bot connecté')
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      if (code !== DisconnectReason.loggedOut) demarrer()
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    const texte = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    if (!texte.startsWith(PREFIX)) return
    const nom = texte.slice(PREFIX.length).trim().split(' ')[0].toLowerCase()
    if (commandes[nom]) await commandes[nom](sock, msg.key.remoteJid)
  })
}

demarrer()
