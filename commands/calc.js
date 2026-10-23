export default {
  nom: 'calc',
  run: async ({ sock, jid, args, config }) => {
    const brut = args.join(' ')
    if (!brut.trim()) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}calc 12*(3+4)` })
    const expr = brut.replace(/,/g, '.').replace(/[x×]/gi, '*').replace(/÷/g, '/').replace(/\^/g, '**')
    if (expr.length > 100 || !/^[0-9+\-*/().%\s]+$/.test(expr)) {
      return sock.sendMessage(jid, { text: '⚠️ Calcul invalide. Utilise seulement des chiffres et + - * / ( ) %' })
    }
    let r
    try {
      r = Function(`"use strict"; return (${expr})`)()
    } catch {
      return sock.sendMessage(jid, { text: '⚠️ Calcul invalide.' })
    }
    if (typeof r !== 'number' || !Number.isFinite(r)) {
      return sock.sendMessage(jid, { text: '⚠️ Résultat impossible à calculer.' })
    }
    await sock.sendMessage(jid, { text: `🧮 ${brut} = ${Number(r.toPrecision(12))}` })
  },
}
