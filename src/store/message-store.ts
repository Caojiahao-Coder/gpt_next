import { ref } from 'vue'
import { defineStore } from 'pinia'
import db from '@/database/db'
import type { NewMessageInfo, TBMessageInfo } from '@/database/table-type'

const useMessageStore = defineStore('messageStore', () => {
  const messageList = ref<TBMessageInfo[]>([])

  function getMessageRecordsByConversationId(conversationId: number): Promise<TBMessageInfo[]> {
    // eslint-disable-next-line promise/param-names
    return new Promise((reslove, reject) => {
      db.init().then(() => {
        db.select('tb_message', 'conversation_id', conversationId).then((res) => {
          reslove(res as TBMessageInfo[])
        })
      })
    })
  }

  function addNewMessage(data: NewMessageInfo) {
    db.init().then(() => {
      db.add('tb_message', data).then((res) => {
        getMessageRecordsByConversationId(data.conversation_id).then((res) => {
          messageList.value = res
        })
      })
    })
  }

  function updateMessageInfo(data: TBMessageInfo): Promise<boolean> {
    // eslint-disable-next-line promise/param-names
    return new Promise((reslove, reject) => {
      db.init().then(async () => {
        await db.update('tb_message', data)
        reslove(true)
      })
    })
  }

  async function clearRecords() {
    db.init().then(() => {
      messageList.value.forEach((item) => {
        db.deleteById('tb_message', item.id)
      })
      clearMessageRecords()
    })
  }

  function clearMessageRecords() {
    messageList.value = []
  }

  function deleteMessageItem(id: number): Promise<boolean> {
    // eslint-disable-next-line promise/param-names
    return new Promise((reslove, reject) => {
      db.init().then(async () => {
        await db.deleteById('tb_message', id)
        reslove(true)
      })
    })
  }

  return {
    messageList,
    getMessageRecordsByConversationId,
    addNewMessage,
    updateMessageInfo,
    clearMessageRecords,
    clearRecords,
    deleteMessageItem,
  }
})

export default useMessageStore
