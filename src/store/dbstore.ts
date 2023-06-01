import Dexie, { type Table } from 'dexie'
import { defineStore } from 'pinia'

// #region Global Setting
export interface GlobalSetting {
  openAIKey?: string
  chatModel?: string
}

class GlobalSettingDatabase extends Dexie {
  public globalSetting!: Table<GlobalSetting, number>

  constructor() {
    super('GlobalSettingDB')
    this.version(1).stores({
      globalSetting: '++id,openAIKey,chatModel',
    })
  }
}

export const useGlobalSettingDBStore = defineStore('globalSettingDBStore', () => {
  const db = new GlobalSettingDatabase()
  return { db }
})
// #endregion

// #region Conversation
export interface Conversation {
  id?: number
  name: string
  token: string
  model: string
  createTime: string
  description?: string
  color: string
}

class ConversationDatabase extends Dexie {
  public conversations!: Table<Conversation, number>

  public constructor() {
    super('ConversationDB')
    this.version(1).stores({
      conversations: '++id,name,token,model,createTime,description,color',
    })
  }
}

export const useConversationDBStore = defineStore('conversationDBStore', () => {
  const db = new ConversationDatabase()
  return { db }
})
// #endregion

// #region Message
export interface Message {
  id?: number
  content?: string
  role: 'user' | 'gpt'
  conversationId: number
  converstaionToken: string
  createTime: string
  error: boolean
}

class MessageDatabase extends Dexie {
  public messages!: Table<Message, number>

  public constructor() {
    super('MessageDB')
    this.version(1).stores({
      messages: '++id,content,role,conversationId,converstaionToken,createTime,error',
    })
  }
}

export const useMessageDBStore = defineStore('messageDBStore', () => {
  const db = new MessageDatabase()
  return { db }
})
// #endregion
