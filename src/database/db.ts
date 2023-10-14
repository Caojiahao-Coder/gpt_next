import type { NewConverstationInfo, NewGlobalSettingInfo, NewMessageInfo, TBConverstationInfo, TBGlobalSettingInfo, TBMessageInfo } from './table-type'

/**
 * 数据库文件
 */
class DB {
  db: IDBDatabase | null
  version: number

  tb_global = 'tb_global'
  tb_conversation = 'tb_conversation'
  tb_message = 'tb_message'

  constructor() {
    this.db = null
    this.version = 7
  }

  /**
   * 初始化数据库
   */
  init() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('chat_next_db', this.version)

      request.onsuccess = () => {
        this.db = (request as IDBOpenDBRequest).result
        resolve(1)
      }

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result

        if (!this.db.objectStoreNames.contains(this.tb_global))
          this.initGlobalTable()

        if (!this.db.objectStoreNames.contains(this.tb_message))
          this.initMessageTable()

        if (!this.db.objectStoreNames.contains(this.tb_conversation))
          this.initConversationTable()
      }

      request.onerror = (error) => {
        reject(error)
      }
    })
  }

  /**
   * 数据添加操作
   * @param tb
   * @param data
   * @returns
   */
  add(tb: 'tb_global' | 'tb_conversation' | 'tb_message', data: NewGlobalSettingInfo | NewConverstationInfo | NewMessageInfo) {
    return new Promise((resolve, reject) => {
      const request = this.db?.transaction([tb], 'readwrite').objectStore(tb).add(data)

      if (!request)
        return

      request!.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result)
      }

      request.onerror = (event) => {
        reject(event)
      }
    })
  }

  /**
   * get item by id
   * @param tb
   * @param key
   * @returns
   */
  selectById(tb: 'tb_global' | 'tb_conversation' | 'tb_message', key: number) {
    return new Promise((resolve, reject) => {
      const request = this.db?.transaction([tb])
        .objectStore(tb)
        .get(key)

      request!.onsuccess = () => {
        if (request?.result)
          resolve(request.result)
        else
          resolve(-1)
      }

      request!.onerror = (error) => {
        reject(error)
      }
    })
  }

  /**
   * 获取所有数据
   * @param tb
   * @returns
   */
  selectAll(tb: 'tb_global' | 'tb_conversation' | 'tb_message') {
    return new Promise((resolve, reject) => {
      const request = this.db?.transaction([tb])
        .objectStore(tb)
        .getAll()

      request!.onsuccess = () => {
        if (request?.result)
          resolve(request.result)
        else
          resolve(-1)
      }

      request!.onerror = (error) => {
        reject(error)
      }
    })
  }

  /**
   * 通过索引获取数据
   * @param tb
   * @param index
   * @param content
   * @returns
   */
  select(tb: 'tb_global' | 'tb_conversation' | 'tb_message', index: string, content: any) {
    return new Promise((resolve, reject) => {
      const request = this.db?.transaction([tb])
        .objectStore(tb)
        .index(index)
        .getAll(content)

      request!.onsuccess = () => {
        if (request?.result)
          resolve(request.result)
        else
          resolve(-1)
      }

      request!.onerror = (error) => {
        reject(error)
      }
    })
  }

  clear(tb: 'tb_global' | 'tb_conversation' | 'tb_message') {
    return new Promise((resolve, reject) => {
      const request = this.db?.transaction([tb])
        .objectStore(tb)
        .clear()

      request!.onsuccess = () => {
        if (request?.result)
          resolve(request.result)
        else
          resolve(-1)
      }

      request!.onerror = (error) => {
        reject(error)
      }
    })
  }

  /**
   * 通过Id删除数据
   * @param tb
   * @param key
   * @returns
   */
  deleteById(tb: 'tb_global' | 'tb_conversation' | 'tb_message', key: number) {
    return new Promise((resolve, reject) => {
      const request = this.db?.transaction([tb], 'readwrite')
        .objectStore(tb)
        .delete(key)

      request!.onsuccess = () => {
        if (request?.result)
          resolve(request.result)

        else
          resolve(-1)
      }

      request!.onerror = (error) => {
        reject(error)
      }
    })
  }

  /**
   * 更新数据
   * @param tb
   * @param data
   * @returns
   */
  update(tb: 'tb_global' | 'tb_conversation' | 'tb_message', data: TBGlobalSettingInfo | TBConverstationInfo | TBMessageInfo) {
    return new Promise((resolve, reject) => {
      const request = this.db?.transaction([tb], 'readwrite')
        .objectStore(tb)
        .put(data)

      request!.onsuccess = (event) => {
        resolve(event)
      }

      request!.onerror = (error) => {
        reject(error)
      }
    })
  }

  /**
   * init global setting table.
   * @returns
   */
  private initGlobalTable() {
    if (!this.db)
      return

    const objectStore = this.db.createObjectStore(this.tb_global, { keyPath: 'id', autoIncrement: true })
    objectStore.createIndex('id', 'id', { unique: true })
    objectStore.createIndex('api_key', 'api_key')
    objectStore.createIndex('chat_model', 'chat_model')
  }

  /**
   * init message table
   * @returns
   */
  private initMessageTable() {
    if (!this.db)
      return

    const objectStore = this.db.createObjectStore(this.tb_message, { keyPath: 'id', autoIncrement: true })
    objectStore.createIndex('id', 'id', { unique: true })
    objectStore.createIndex('conversation_id', 'conversation_id')
    objectStore.createIndex('user_content', 'user_content')
    objectStore.createIndex('gpt_content', 'gpt_content')
    objectStore.createIndex('create_time', 'create_time')
    objectStore.createIndex('token_id', 'token_id')
    objectStore.createIndex('status', 'status')
  }

  /**
   * init conversation table
   */
  private initConversationTable() {
    if (!this.db)
      return

    const objectStore = this.db.createObjectStore(this.tb_conversation, { keyPath: 'id', autoIncrement: true })
    objectStore.createIndex('id', 'id', { unique: true })
    objectStore.createIndex('title', 'title')
    objectStore.createIndex('description', 'description')
    objectStore.createIndex('color', 'color')
    objectStore.createIndex('create_time', 'create_time')
    objectStore.createIndex('conversation_token', 'conversation_token')
    objectStore.createIndex('fixed_top', 'fixed_top')
    objectStore.createIndex('type', 'type')
  }
}

const db = new DB()

export default db
