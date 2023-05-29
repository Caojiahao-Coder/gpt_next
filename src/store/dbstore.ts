import Dexie, { type Table } from 'dexie'
import { defineStore } from 'pinia'

export interface Conversation {
  id?: number
  name?: string
  token?: string
  model?: string
  createTime?: string
}

class ConversationDatabase extends Dexie {
  public conversations!: Table<Conversation, number>

  public constructor() {
    super('ConversationDB')
    this.version(1).stores({
      conversations: '++id,name,token,model,createTime',
    })
  }
}

export const useConversationDBStore = defineStore('conversationDBStore', () => {
  const db = new ConversationDatabase()
  return { db }
})
