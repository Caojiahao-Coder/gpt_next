import db from "@/database/db";
import { ref } from 'vue'
import type { NewMessageInfo, TBMessageInfo } from "@/database/table-type";
import { defineStore } from "pinia";

const useMessageStore = defineStore('messageStore', () => {

  const messageList = ref<TBMessageInfo[]>([])

  function getMessageRecordsByConversationId(conversationId: number): Promise<TBMessageInfo[]> {
    return new Promise((reslove, reject) => {
      db.init().then(() => {
        db.select('tb_message', 'conversation_id', conversationId).then(res => {
          reslove(res as TBMessageInfo[])
        })
      })
    })
  }

  function addNewMessage(data: NewMessageInfo) {
    db.init().then(() => {
      db.add('tb_message', data).then((res) => {
        getMessageRecordsByConversationId(data.conversation_id).then(msessageListData => {
          messageList.value = msessageListData
        })
      })
    })
  }

  function updateMessageInfo(data: TBMessageInfo) {
    db.init().then(() => {
      db.update('tb_message', data)
    })
  }

  function clearRecords(conversationId: number) {
    db.init().then(() => {
      getMessageRecordsByConversationId(conversationId).then(res => {
        res.map(item => {
          db.deleteById('tb_message', item.id)
        })
        clearMessageRecords()
      })
    })
  }

  function clearMessageRecords() {
    messageList.value = []
  }

  return {
    messageList,
    getMessageRecordsByConversationId,
    addNewMessage,
    updateMessageInfo,
    clearMessageRecords,
    clearRecords
  }
})

export default useMessageStore
