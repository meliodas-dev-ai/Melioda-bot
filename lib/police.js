export function police(texte) {
  return [...String(texte).normalize('NFD')]
    .map((c) => {
      const n = c.codePointAt(0)
      if (n >= 65 && n <= 90) return String.fromCodePoint(0x1d670 + n - 65)
      if (n >= 97 && n <= 122) return String.fromCodePoint(0x1d68a + n - 97)
      if (n >= 48 && n <= 57) return String.fromCodePoint(0x1d7f6 + n - 48)
      return c
    })
    .join('')
}
