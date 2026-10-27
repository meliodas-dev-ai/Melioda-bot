const BT = '```'
const formats = ['base64', 'hex']

export default {
  nom: 'decode',
  run: async ({ sock, jid, args, config }) => {
    let format = 'base64'
    if (formats.includes((args[0] || '').toLowerCase())) format = args.shift().toLowerCase()
    const brut = args.join('')
    if (!brut) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}decode [base64|hex] <texte encodé>` })
    if (brut.length > 1000) return sock.sendMessage(jid, { text: '⚠️ Texte trop long (1000 caractères maximum).' })
    const valide = format === 'hex' ? /^([0-9a-fA-F]{2})+$/.test(brut) : /^[A-Za-z0-9+/_-]+={0,2}$/.test(brut)
    if (!valide) return sock.sendMessage(jid, { text: `⚠️ Ce texte n'est pas du ${format} valide.` })
    let r = Buffer.from(brut, format).toString('utf8')
    if (r.includes('\uFFFD') || !r) {
      return sock.sendMessage(jid, { text: "⚠️ Impossible de décoder : le résultat n'est pas du texte." })
    }
    r = r.replace(/\r?\n/g, ' ').replace(/`/g, "'").slice(0, 500)
    await sock.sendMessage(jid, { text: `🔓 Décodé (${format}) :\n${BT}${r}${BT}` })
  },
}
