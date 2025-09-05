import Dexie from 'dexie'
import type { UIMessage } from 'ai'
import type { EntityTable } from 'dexie'
import type { ModelName } from '~/models'

interface Model {
  id: number
  name: string
  type: ModelName
  baseURL: string
  apiKey: string
  model: string
}

export interface Chat {
  id: number
  modelId: number | null
  messages: UIMessage[]
}

const db = new Dexie('ai-bender') as Dexie & {
  models: EntityTable<Model, 'id'>
  chats: EntityTable<Chat, 'id'>
}

db.version(1).stores({
  models: '++id, name, type, baseURL, apiKey, model',
  chats: '++id, modelId, messages',
})

db.on('populate', (tx) => {
  tx.table('chats').add({
    modelId: null,
    messages: [],
  })
})

export type { Model }
export { db }
