import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import pino from 'pino'

const lancer = promisify(execFile)

export function trouverMedia(msg, jid, types) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo
  for (const t of types) {
    if (msg.message?.[t]) return { source: msg, contenu: msg.message[t] }
    if (ctx?.quotedMessage?.[t]) {
      return {
        source: {
          key: { remoteJid: jid, id: ctx.stanzaId, participant: ctx.participant },
          message: ctx.quotedMessage,
        },
        contenu: ctx.quotedMessage[t],
      }
    }
  }
  return null
}

export function telecharger(sock, source) {
  return downloadMediaMessage(source, 'buffer', {}, {
    logger: pino({ level: 'silent' }),
    reuploadRequest: sock.updateMediaMessage,
  })
}

export async function convertir(buffer, args, extension) {
  const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'med-'))
  try {
    const entree = path.join(dossier, 'in')
    const sortie = path.join(dossier, 'out.' + extension)
    fs.writeFileSync(entree, buffer)
    await lancer('ffmpeg', ['-y', '-i', entree, ...args, sortie], { timeout: 30000 })
    return fs.readFileSync(sortie)
  } finally {
    fs.rmSync(dossier, { recursive: true, force: true })
  }
}
