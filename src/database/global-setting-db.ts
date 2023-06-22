/**
 * Project Global Setting Storeage DB
 *
 * ------------------------
 * |id|openAiKey|chatModel|
 * ------------------------
 */

import Dexie, { type Table } from 'dexie'
import { defineStore } from 'pinia'

/**
 * Global Setting Table Entity Class
 */
export interface GlobalSettingTable {
  id: Number
  openAIKey: String
  chatModel: String
}

/**
 * Create Global Setting DB
 */
class GlobalSettingDB extends Dexie {
  public globalSetting!: Table<GlobalSettingTable, number>

  constructor() {
    super('GlobalSettingDB')
    this.version(1).stores({
      globalSetting: '++id,openAIKey,chatModel',
    })
  }
}

/**
 * Config Global Store from Global Setting DB
 */
export const useGlobalSettingDBStore = defineStore('globalSetttingDBStore', () => {
  const db = new GlobalSettingDB()
  return { db }
})
