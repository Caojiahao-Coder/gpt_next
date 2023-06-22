/**
 * Conversation Storeage DB
 *
 * ---------------------------------------
 * |id|title|description|color|createTime|
 * ---------------------------------------
 */

import Dexie, { type Table } from 'dexie'
import { defineStore } from 'pinia'

/**
 * Converstation Table Entity Class
 */
export interface ConversationTable {
  id: Number
  title: String
  description: String
  color: String
  createTime: String
}

/**
 * Create Conversation DB
 */
class ConversationDB extends Dexie {
  public converstation!: Table<ConversationTable, number>

  constructor() {
    super('ConversationDB')
    this.version(1).stores({
      converstation: '++id,title,description,color,createTime',
    })
  }
}

/**
 * Config Global Store from Conversation DB
 */
export const useConversationDBStore = defineStore('conversationDBStore', () => {
  const db = new ConversationDB()
  return { db }
})
