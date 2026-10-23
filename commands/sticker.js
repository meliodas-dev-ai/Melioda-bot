import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import pino from 'pino'

const lancer = promisify(execFile)

const filtres = {
  crop: 'scale=512:512:force_original_aspect_ratio=increase,crop=512:512,format=rgba',
  fit: 'scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0',
}

export default {
  nom: 'sticker',
  alias: ['s'],
  run: async ({ sock, jid, msg, args, config }) => {
    const ctx = msg.message?.extendedTextMessage?.contextInfo
    let source = null
    if (msg.message?.imageMessage) {
      source = msg
    } else if (ctx?.quotedMessage?.imageMessage) {
      source = {
        key: { remoteJid: jid, id: ctx.stanzaId, participant: ctx.participant },
        message: ctx.quotedMessage,
      }
    }
    if (!source) {
      return sock.sendMessage(jid, {
        text: `Utilisation : réponds à une image avec ${config.prefix}sticker\nOption : ${config.prefix}sticker fit (image entière, sans recadrage)`,
      })
    }

    const mode = (args[0] || '').toLowerCase() === 'fit' ? 'fit' : 'crop'
    const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'stk-'))
    try {
      const buffer = await downloadMediaMessage(source, 'buffer', {}, {
        logger: pino({ level: 'silent' }),
        reuploadRequest: sock.updateMediaMessage,
      })
      const entree = path.join(dossier, 'in')
      const sortie = path.join(dossier, 'out.webp')
      fs.writeFileSync(entree, buffer)

      let resultat = null
      for (const q of [80, 60, 40, 25]) {
        await lancer(
          'ffmpeg',
          ['-y', '-i', entree, '-vf', filtres[mode], '-frames:v', '1', '-c:v', 'libwebp', '-lossless', '0', '-q:v', String(q), '-compression_level', '6', '-an', sortie],
          { timeout: 30000 }
        )
        resultat = fs.readFileSync(sortie)
        if (resultat.length <= 100 * 1024) break
      }
      await sock.sendMessage(jid, { sticker: resultat })
    } catch (e) {
      console.log('⚠️ Erreur sticker -', e.message)
      const texte = e.code === 'ENOENT' ? '⚠️ Outil de conversion absent (ffmpeg).' : '⚠️ Impossible de créer le sticker.'
      await sock.sendMessage(jid, { text: texte })
    } finally {
      fs.rmSync(dossier, { recursive: true, force: true })
    }
  },
}
