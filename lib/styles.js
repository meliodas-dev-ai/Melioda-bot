const ALPHABETS = [
  ['Gras', 0x1d400, 0x1d41a, 0x1d7ce],
  ['Italique', 0x1d434, 0x1d44e, null],
  ['Gras italique', 0x1d468, 0x1d482, null],
  ['Script gras', 0x1d4d0, 0x1d4ea, null],
  ['Gothique gras', 0x1d56c, 0x1d586, null],
  ['Sans', 0x1d5a0, 0x1d5ba, 0x1d7e2],
  ['Sans gras', 0x1d5d4, 0x1d5ee, 0x1d7ec],
  ['Sans italique', 0x1d608, 0x1d622, null],
  ['Sans gras italique', 0x1d63c, 0x1d656, null],
  ['Machine', 0x1d670, 0x1d68a, 0x1d7f6],
  ['Pleine chasse', 0xff21, 0xff41, 0xff10],
  ['Cercle', 0x24b6, 0x24d0, null],
]
const MARQUES = [['Souligné', '\u0332'], ['Barré', '\u0336'], ['Slashé', '\u0337'], ['Surligné', '\u0305']]
const CADRES = [
  ['Chevrons', '《', '》'], ['Crochets', '【', '】'], ['Japonais', '『', '』'], ['Coins', '「', '」'],
  ['Parenthèses', '〔', '〕'], ['Ornement', '༺', '༻'], ['Dragon', '꧁', '꧂'], ['Hiéroglyphe', '𓆩', '𓆪'],
  ['Couronne', '♛ ', ' ♛'], ['Lunaire', '⸙ ', ''], ['Accolades', '〘', '〙'], ['Ailes', '⟦', '⟧'],
]

function alpha(texte, maj, min, chi) {
  return [...texte]
    .map((c) => {
      const n = c.codePointAt(0)
      if (n >= 65 && n <= 90 && maj) return String.fromCodePoint(maj + n - 65)
      if (n >= 97 && n <= 122 && min) {
        if (c === 'h' && min === 0x1d44e && maj === 0x1d434) return '\u210e'
        return String.fromCodePoint(min + n - 97)
      }
      if (n >= 48 && n <= 57 && chi) return String.fromCodePoint(chi + n - 48)
      return c
    })
    .join('')
}

const avecMarque = (texte, m) =>
  [...texte].map((c) => (/[\p{L}\p{N}]|[\u24b6-\u24e9]/u.test(c) ? c + m : c)).join('')

export const STYLES = []
for (const [nom, maj, min, chi] of ALPHABETS) {
  STYLES.push({ nom, appliquer: (t) => alpha(t, maj, min, chi) })
}
for (const [nom, m] of MARQUES) {
  STYLES.push({ nom, appliquer: (t) => avecMarque(t, m) })
}
for (const [nom, maj, min, chi] of ALPHABETS) {
  for (const [mn, m] of MARQUES) {
    STYLES.push({ nom: `${nom} ${mn.toLowerCase()}`, appliquer: (t) => avecMarque(alpha(t, maj, min, chi), m) })
  }
}
for (const [nom, l, r] of CADRES) {
  STYLES.push({ nom: `Cadre ${nom.toLowerCase()}`, appliquer: (t) => l + t + r })
}

import { STYLES_EXTRA } from './styles2.js'
STYLES.push(...STYLES_EXTRA)
