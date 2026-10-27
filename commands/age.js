export default {
  nom: 'age',
  run: async ({ sock, jid, args, config }) => {
    const m = (args[0] || '').match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/)
    if (!m) return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}age JJ/MM/AAAA\nExemple : ${config.prefix}age 15/08/1998` })
    const j = Number(m[1])
    const mo = Number(m[2])
    const a = Number(m[3])
    const naissance = new Date(Date.UTC(a, mo - 1, j))
    if (naissance.getUTCDate() !== j || naissance.getUTCMonth() !== mo - 1 || a < 1900) {
      return sock.sendMessage(jid, { text: '⚠️ Date invalide.' })
    }
    const auj = new Date()
    const y = auj.getUTCFullYear()
    const ajd = Date.UTC(y, auj.getUTCMonth(), auj.getUTCDate())
    if (naissance.getTime() > ajd) return sock.sendMessage(jid, { text: "⚠️ Cette date est dans le futur." })
    let ans = y - a
    let mois = auj.getUTCMonth() - (mo - 1)
    let jours = auj.getUTCDate() - j
    if (jours < 0) {
      mois--
      jours += new Date(Date.UTC(y, auj.getUTCMonth(), 0)).getUTCDate()
    }
    if (mois < 0) {
      ans--
      mois += 12
    }
    let prochain = Date.UTC(y, mo - 1, j)
    if (prochain < ajd) prochain = Date.UTC(y + 1, mo - 1, j)
    const reste = Math.round((prochain - ajd) / 86400000)
    const anniv = reste === 0 ? "🎂 C'est ton anniversaire aujourd'hui !" : `🎂 Prochain anniversaire dans ${reste} jour(s)`
    await sock.sendMessage(jid, { text: `🎈 Âge : ${ans} an(s), ${mois} mois et ${jours} jour(s)\n${anniv}` })
  },
}
