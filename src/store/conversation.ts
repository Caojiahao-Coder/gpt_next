import { defineStore } from 'pinia'
import { ref } from 'vue'
import { uid } from 'uid'
import dayjs from 'dayjs'
import type { Conversation } from './dbstore'
import { useConversationDBStore } from './dbstore'

export const useConversationStore = defineStore('conversation', () => {
  const conversationDBStore = useConversationDBStore()

  const db = conversationDBStore.db

  const conversationInfo = ref<Conversation>()

  async function createConversation() {
    const token = uid(32)

    const newConversationId = await db.conversations.add({
      token,
      name: 'New Message',
      createTime: dayjs().format('yyyy-MM-dd HH:mm:ss'),
    })

    conversationInfo.value = await db.conversations.get(newConversationId)
  }

  return { conversationInfo, createConversation }
})
