import Dexie, { type Table } from 'dexie'
import { defineStore } from 'pinia'

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

// #region Conversation
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
// #endregion
