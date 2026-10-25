import { MongoClient } from 'mongodb'

let col = null

export async function initStockage() {
  const uri = process.env.MONGODB_URI
  if (!uri || col) return
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 })
    await client.connect()
    col = client.db('meliodas').collection('kv')
    console.log('🗄️ Stockage MongoDB actif')
  } catch (e) {
    console.log('⚠️ MongoDB indisponible, stockage local utilisé -', e.message)
  }
}

export const mongoActif = () => col !== null

const echapper = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export async function lireDoc(id, reviver) {
  const d = await col.findOne({ _id: id })
  return d ? JSON.parse(d.v, reviver) : null
}

export const ecrireDoc = (id, valeur, replacer) =>
  col.updateOne({ _id: id }, { $set: { v: JSON.stringify(valeur, replacer) } }, { upsert: true })

export const supprimerDoc = (id) => col.deleteOne({ _id: id })

export const supprimerPrefixe = (prefixe) =>
  col.deleteMany({ _id: { $regex: '^' + echapper(prefixe) } })

export async function listerPrefixe(prefixe) {
  const docs = await col.find({ _id: { $regex: '^' + echapper(prefixe) } }).toArray()
  return docs.map((d) => [d._id, JSON.parse(d.v)])
}

export async function listerCreds() {
  const docs = await col
    .find({ _id: { $regex: '^auth\\|[0-9]+\\|creds$' } }, { projection: { _id: 1 } })
    .toArray()
  return docs.map((d) => d._id.split('|')[1])
}
