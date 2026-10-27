export const styles = [
  ['Gras', 0x1d400, 0x1d41a, 0x1d7ce],
  ['Gras italique', 0x1d468, 0x1d482, 0x1d7ce],
  ['Sans-serif gras', 0x1d5d4, 0x1d5ee, 0x1d7ec],
  ['Script gras', 0x1d4d0, 0x1d4ea, 0x1d7ce],
  ['Gothique gras', 0x1d56c, 0x1d586, 0x1d7ce],
  ['Machine à écrire', 0x1d670, 0x1d68a, 0x1d7f6],
]

export function convertir(texte, style) {
  const [, maj, min, chi] = style
  return [...texte.normalize('NFD')]
    .map((c) => {
      const n = c.codePointAt(0)
      if (n >= 65 && n <= 90) return String.fromCodePoint(maj + n - 65)
      if (n >= 97 && n <= 122) return String.fromCodePoint(min + n - 97)
      if (n >= 48 && n <= 57) return String.fromCodePoint(chi + n - 48)
      return c
    })
    .join('')
}
