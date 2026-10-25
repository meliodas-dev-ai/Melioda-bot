import { initAuthCreds, BufferJSON, proto } from '@whiskeysockets/baileys'
import { lireDoc, ecrireDoc, supprimerDoc } from './stockage.js'

export async function useMongoAuthState(numero) {
  const base = `auth|${numero}|`
  const lire = (id) => lireDoc(base + id, BufferJSON.reviver)
  const ecrire = (id, v) => ecrireDoc(base + id, v, BufferJSON.replacer)
  const creds = (await lire('creds')) || initAuthCreds()

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {}
          await Promise.all(
            ids.map(async (id) => {
              let v = await lire(`${type}-${id}`)
              if (type === 'app-state-sync-key' && v) v = proto.Message.AppStateSyncKeyData.fromObject(v)
              data[id] = v
            })
          )
          return data
        },
        set: async (data) => {
          const taches = []
          for (const categorie in data) {
            for (const id in data[categorie]) {
              const v = data[categorie][id]
              const cle = `${categorie}-${id}`
              taches.push(v ? ecrire(cle, v) : supprimerDoc(base + cle))
            }
          }
          await Promise.all(taches)
        },
      },
    },
    saveCreds: () => ecrire('creds', creds),
  }
}
