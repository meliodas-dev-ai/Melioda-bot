import QRCode from 'qrcode'

export default {
  nom: 'qr',
  run: async ({ sock, jid, args, config }) => {
    const texte = args.join(' ')
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}qr <texte ou lien>` })
    if (texte.length > 500) return sock.sendMessage(jid, { text: '⚠️ Texte trop long (500 caractères maximum).' })
    const image = await QRCode.toBuffer(texte, { width: 500, margin: 2 })
    await sock.sendMessage(jid, { image, caption: '🔳 QR code généré' })
  },
}
