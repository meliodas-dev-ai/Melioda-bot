import fs from 'fs'
import { AsyncLocalStorage } from 'async_hooks'
import { initStockage, mongoActif, listerPrefixe, ecrireDoc, supprimerPrefixe } from './stockage.js'

export const contexte = new AsyncLocalStorage()

const fichier = (process.env.DATA_DIR || '.') + '/data.json'
let data = {}

await initStockage()
if (mongoActif()) {
  for (const [id, valeur] of await listerPrefixe('data|')) data[id.slice(5)] = valeur
} else {
  try {
    data = JSON.parse(fs.readFileSync(fichier, 'utf8'))
  } catch {}
}

const cle = (k) => {
  const c = contexte.getStore()?.compte
  return c ? `${c}|${k}` : k
}

function persister(k) {
  if (mongoActif()) {
    ecrireDoc('data|' + k, data[k]).catch((e) => console.log('⚠️ Sauvegarde MongoDB -', e.message))
  } else {
    fs.writeFileSync(fichier, JSON.stringify(data, null, 2))
  }
}

export function lire(k, defaut) {
  return data[cle(k)] ?? defaut
}

export function ecrire(k, valeur) {
  const kk = cle(k)
  data[kk] = valeur
  persister(kk)
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
  if (mongoActif()) supprimerPrefixe('data|' + pre).catch(() => {})
  else fs.writeFileSync(fichier, JSON.stringify(data, null, 2))
}
