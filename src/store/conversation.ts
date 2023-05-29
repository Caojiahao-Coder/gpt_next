import { defineStore } from 'pinia'
import { ref } from 'vue'
import { uid } from 'uid'
import dayjs from 'dayjs'
import { useConversationDBStore } from './dbstore'

export const useConversationStore = defineStore('conversation', () => {
  const conversationDBStore = useConversationDBStore()

  const db = conversationDBStore.db

  const conversationToken = ref<string>()

  const conversationName = ref<string>()

  async function createConversation() {
    const token = uid(32)

    await db.conversations.add({
      token,
      name: 'New Message',
      createTime: dayjs().format('yyyy-MM-dd HH:mm:ss'),
    })

    conversationToken.value = token
    conversationName.value = 'New Message'
  }

  return { conversationToken, createConversation, conversationName }
})
