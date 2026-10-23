import fs from 'fs'
import { AsyncLocalStorage } from 'async_hooks'

export const contexte = new AsyncLocalStorage()

const fichier = (process.env.DATA_DIR || '.') + '/data.json'
let data = {}
try {
  data = JSON.parse(fs.readFileSync(fichier, 'utf8'))
} catch {}

const cle = (k) => {
  const c = contexte.getStore()?.compte
  return c ? `${c}|${k}` : k
}

const sauver = () => fs.writeFileSync(fichier, JSON.stringify(data, null, 2))

export function lire(k, defaut) {
  return data[cle(k)] ?? defaut
}

export function ecrire(k, valeur) {
  data[cle(k)] = valeur
  sauver()
}

export function exporter() {
  const c = contexte.getStore()?.compte
  if (!c) return data
  const pre = c + '|'
  return Object.fromEntries(
    Object.entries(data).filter(([k]) => k.startsWith(pre)).map(([k, v]) => [k.slice(pre.length), v])
  )
}

export function effacer(compte) {
  const pre = compte + '|'
  for (const k of Object.keys(data)) if (k.startsWith(pre)) delete data[k]
  sauver()
}
