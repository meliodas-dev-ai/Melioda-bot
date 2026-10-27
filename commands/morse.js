const table = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
}
const inverse = Object.fromEntries(Object.entries(table).map(([k, v]) => [v, k]))

export default {
  nom: 'morse',
  run: async ({ sock, jid, args, config }) => {
    const decoder = (args[0] || '').toLowerCase() === 'decode'
    const saisie = (decoder ? args.slice(1) : args).join(' ').trim()
    if (!saisie) {
      return sock.sendMessage(jid, { text: `Utilisation : ${config.prefix}morse <texte>\nOu : ${config.prefix}morse decode <code>\n(lettres séparées par un espace, mots par /)` })
    }
    if (saisie.length > 300) return sock.sendMessage(jid, { text: '⚠️ Texte trop long (300 caractères maximum).' })
    let r
    if (decoder) {
      r = saisie.split(/\s*\/\s*/).map((mot) => mot.split(/\s+/).map((c) => inverse[c] || '?').join('')).join(' ')
    } else {
      r = saisie
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .split(/\s+/)
        .map((mot) => [...mot].map((c) => table[c]).filter(Boolean).join(' '))
        .filter(Boolean)
        .join(' / ')
    }
    await sock.sendMessage(jid, { text: r ? `📡 ${r}` : '⚠️ Rien à convertir.' })
  },
}
