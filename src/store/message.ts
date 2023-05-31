import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useConversationStore } from './conversation'
import { type Message, useMessageDBStore } from './dbstore'

export const useMessageStore = defineStore('messageStore', () => {
  const messageRecords = ref<Message[]>([])

  const conversationStore = useConversationStore()

  const messageDB = useMessageDBStore().db

  conversationStore.$subscribe((mutation, state) => {
    getMessageRecoreds()
  })

  async function getMessageRecoreds() {
    messageRecords.value = []
    const data = await messageDB.messages.where({
      conversationId: conversationStore.conversationInfo?.id ?? -1,
    }).toArray()
    messageRecords.value = data
  }

  async function addNewMessage(info: Message) {
    const existingData = [...messageRecords.value]
    existingData.push(info)
    await messageDB.messages.add(info)
    messageRecords.value = existingData
  }

  async function updateMessageContent(info: Message, id: number) {
    await messageDB.messages.put(info, id)
  }

  async function clearMessageRecords(conversationId: number) {
    await messageDB.messages.bulkDelete(
      (await messageDB.messages.where({ conversationId }).toArray()).map(a => a.id!),
    )
    messageRecords.value = []
  }

  return { messageRecords, addNewMessage, updateMessageContent, clearMessageRecords }
})