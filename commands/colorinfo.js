export default {
  nom: 'colorinfo',
  run: async ({ sock, jid, args, config }) => {
    const h = (args[0] || '').replace('#', '')
    if (!/^[0-9a-fA-F]{6}$/.test(h)) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}colorinfo #FF3B4F` })
    }
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    const lum = Math.round((0.299 * r + 0.587 * g + 0.114 * b) / 2.55)
    await sock.sendMessage(jid, {
      text: `🎨 #${h.toUpperCase()}\nRGB : ${r}, ${g}, ${b}\nLuminosité : ${lum} % (${lum > 50 ? 'claire' : 'sombre'})`,
    })
  },
}
