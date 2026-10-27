const BT = '```'
const formats = ['base64', 'hex']

export default {
  nom: 'encode',
  run: async ({ sock, jid, args, config }) => {
    let format = 'base64'
    if (formats.includes((args[0] || '').toLowerCase())) format = args.shift().toLowerCase()
    const texte = args.join(' ')
    if (!texte) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}encode [base64|hex] <texte>` })
    if (texte.length > 500) return sock.sendMessage(jid, { text: '⚠️ Texte trop long (500 caractères maximum).' })
    const r = Buffer.from(texte, 'utf8').toString(format)
    await sock.sendMessage(jid, { text: `🔐 Encodé (${format}) :\n${BT}${r}${BT}` })
  },
}
