import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import useMessageStore from './message-store'
import type { NewConverstationInfo, TBConverstationInfo } from '@/database/table-type'
import db from '@/database/db'

const useConversationStore = defineStore('conversationStore', () => {
  const conversationInfo = ref<TBConverstationInfo | null>(null)
  const conversationsList = ref<TBConverstationInfo[]>([])

  watch(conversationInfo, (newValue) => {
    const messageStore = useMessageStore()

    if (!newValue)
      messageStore.clearMessageRecords()

    messageStore.messageList = []
    if (newValue) {
      messageStore.getMessageRecordsByConversationId(newValue!.id).then((res) => {
        messageStore.messageList = res
      })
    }
  })

  function createNewConversation(data: NewConverstationInfo): Promise<number> {
    // eslint-disable-next-line promise/param-names
    return new Promise<number>((_reslove, _reject) => {
      db.init().then(() => {
        db.add('tb_conversation', data).then((res) => {
          updateConversationsList()
          getConversationInfoById(res as number)
          _reslove(res as number)
        })
      })
    })
  }

  function deleteConversationById(key: number) {
    db.init().then(() => {
      db.deleteById('tb_conversation', key).then(() => {
        updateConversationsList()
        conversationInfo.value = null
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

  function updateConversationsList(callback?: () => void) {
    db.init().then(() => {
      db.selectAll('tb_conversation').then((res) => {
        conversationsList.value = (res as TBConverstationInfo[])
          .sort((a, b) => {
            if (a.fixed_top && !b.fixed_top)
              return -1

            else if (!a.fixed_top && b.fixed_top)
              return 1

            else
              return b.create_time - a.create_time
          })
        if (callback)
          callback()
      })
    })
  }

  function getConversationInfoById(conversationId: number) {
    db.init().then(() => {
      db.selectById('tb_conversation', conversationId).then((res) => {
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
    updateConversationInfoById,
  }
})

export default useConversationStore
