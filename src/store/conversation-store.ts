import db from '@/database/db';
import { ref, watch } from 'vue'
import type { NewConverstationInfo, TBConverstationInfo } from '@/database/table-type';
import { defineStore } from 'pinia';
import useMessageStore from './message-store';

const useConversationStore = defineStore('conversationStore', () => {

  const conversationInfo = ref<TBConverstationInfo>()
  const conversationsList = ref<TBConverstationInfo[]>([])

  watch(conversationInfo, async (newValue, oldValue) => {
    const messageStore = useMessageStore()

    if (!newValue) {
      messageStore.clearMessageRecords()
    }
    var data = await messageStore.getMessageRecordsByConversationId(newValue!.id)
    messageStore.messageList = data
  })

  function createNewConversation(data: NewConverstationInfo): Promise<number> {
    return new Promise<number>((reslove, reject) => {
      db.init().then(() => {
        db.add('tb_conversation', data).then((res) => {
          updateConversationsList()
          getConversationInfoById(res as number)
          reslove(res as number)
        })
      })
    })
  }

  function deleteConversationById(key: number) {
    db.init().then(() => {
      db.deleteById('tb_conversation', key).then(() => {
        updateConversationsList()
        conversationInfo.value = undefined
      })
    })
  }

  function updateConversationInfoById(data: TBConverstationInfo) {
    db.init().then(() => {
      db.update('tb_conversation', data).then(() => {
        conversationInfo.value = data
        updateConversationsList()
      })
    })
  }

  function updateConversationsList() {
    db.init().then(() => {
      db.selectAll('tb_conversation').then(res => {
        conversationsList.value = (res as TBConverstationInfo[])
          .sort((a, b) => {
            return b.create_time - a.create_time
          })
      })
    })
  }

  function getConversationInfoById(conversationId: number) {
    db.init().then(() => {
      db.selectById('tb_conversation', conversationId).then(res => {
        conversationInfo.value = res as TBConverstationInfo
      })
    })
  }

  return {
    conversationInfo,
    conversationsList,

    updateConversationsList,

    createNewConversation,
    deleteConversationById,
    updateConversationInfoById
  }
})

export default useConversationStore
