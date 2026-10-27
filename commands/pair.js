export default {
  nom: 'pair',
  run: async ({ sock, jid }) => {
    const site = process.env.LIEN_SITE || process.env.RENDER_EXTERNAL_URL
    const telegram = process.env.LIEN_TELEGRAM
    if (!site && !telegram) {
      return sock.sendMessage(jid, { text: '⚠️ Les liens de connexion ne sont pas encore configurés.' })
    }
    let texte = '🔗 Connecte ton compte au bot\n'
    if (site) texte += `\n🌐 Site : ${site}`
    if (telegram) texte += `\n✈️ Telegram : ${telegram}`
    await sock.sendMessage(jid, { text: texte })
  },
}
