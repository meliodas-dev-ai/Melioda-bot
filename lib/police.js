function convertir(texte, maj, min, chi) {
  return [...String(texte).normalize('NFD')]
    .map((c) => {
      const n = c.codePointAt(0)
      if (n >= 65 && n <= 90) return String.fromCodePoint(maj + n - 65)
      if (n >= 97 && n <= 122) return String.fromCodePoint(min + n - 97)
      if (n >= 48 && n <= 57) return String.fromCodePoint(chi + n - 48)
      return c
    })
    .join('')
}

export const police = (texte) => convertir(texte, 0x1d670, 0x1d68a, 0x1d7f6)
export const policeGras = (texte) => convertir(texte, 0x1d63c, 0x1d656, 0x1d7ec)
