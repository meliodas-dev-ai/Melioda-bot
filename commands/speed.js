export default {
  nom: 'speed',
  run: async ({ sock, jid, msg }) => {
    const wa = Math.max(0, Date.now() - Number(msg.messageTimestamp) * 1000)
    let net = 'indisponible'
    const debut = Date.now()
    try {
      await fetch('https://www.google.com/generate_204', { signal: AbortSignal.timeout(8000) })
      net = `${Date.now() - debut} ms`
    } catch {}
    await sock.sendMessage(jid, { text: `⚡ Vitesse\n\nRéponse WhatsApp : ${wa} ms\nInternet : ${net}` })
  },
}
