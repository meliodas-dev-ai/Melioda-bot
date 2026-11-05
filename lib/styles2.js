const BASES = {
  carre: { maj: 0x1f130, lowerAsMaj: true },
  carreNeg: { maj: 0x1f170, lowerAsMaj: true },
  cercleNeg: { maj: 0x1f150, lowerAsMaj: true },
  parenthese: { min: 0x249c },
  double: {
    maj: 0x1d538,
    min: 0x1d552,
    holes: { C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124 },
  },
}
const NOMS = {
  carre: 'Carré',
  carreNeg: 'Carré négatif',
  cercleNeg: 'Cercle négatif',
  parenthese: 'Parenthèses',
  double: 'Double barre',
}
const MARQUES = [['souligné', '\u0332'], ['barré', '\u0336'], ['slashé', '\u0337'], ['surligné', '\u0305']]
const CADRES = [
  ['Étoiles', '★ ', ' ★'],
  ['Cœur', '♡ ', ' ♡'],
  ['Éclair', '⚡ ', ' ⚡'],
  ['Flèches', '➤ ', ' ➤'],
  ['Triangles', '▲ ', ' ▲'],
]

function alphabet(a, texte) {
  return [...texte]
    .map((c) => {
      const estMaj = c >= 'A' && c <= 'Z'
      const estMin = c >= 'a' && c <= 'z'
      if (!estMaj && !estMin) return c
      const majuscule = c.toUpperCase()
      if (estMaj || a.lowerAsMaj) {
        if (a.holes?.[majuscule]) return String.fromCodePoint(a.holes[majuscule])
        if (a.maj) return String.fromCodePoint(a.maj + majuscule.charCodeAt(0) - 65)
      }
      if (a.min) return String.fromCodePoint(a.min + c.toLowerCase().charCodeAt(0) - 97)
      return c
    })
    .join('')
}

const avecMarque = (texte, m) => [...texte].map((ch) => (ch.trim() ? ch + m : ch)).join('')

export const STYLES_EXTRA = []
for (const cle of Object.keys(BASES)) {
  const a = BASES[cle]
  STYLES_EXTRA.push({ nom: NOMS[cle], appliquer: (t) => alphabet(a, t) })
}
for (const cle of Object.keys(BASES)) {
  for (const [mn, m] of MARQUES) {
    STYLES_EXTRA.push({ nom: `${NOMS[cle]} ${mn}`, appliquer: (t) => avecMarque(alphabet(BASES[cle], t), m) })
  }
}
for (const cle of Object.keys(BASES)) {
  for (const [nomCadre, l, r] of CADRES) {
    STYLES_EXTRA.push({ nom: `${NOMS[cle]} ${nomCadre.toLowerCase()}`, appliquer: (t) => l + alphabet(BASES[cle], t) + r })
  }
}
