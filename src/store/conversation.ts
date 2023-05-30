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

  const conversationList = ref<Conversation[]>()

  async function createConversation() {
    const token = uid(32)

    const newConversationId = await db.conversations.add({
      token,
      name: 'New Message',
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      model: 'gpt-3.5-turbo-0301',
      color: 'bg-gray5',
    })

    conversationInfo.value = await db.conversations.get(newConversationId)

    getConversationList()
  }

  async function updateConversationInfo(id: number, info: Conversation) {
    await db.conversations.put(info, id)
    if (conversationInfo.value?.id === id)
      conversationInfo.value = info

    getConversationList()
  }

  async function deleteConversationInfo(id: number) {
    await db.conversations.delete(id)
    if (conversationInfo.value?.id === id)
      conversationInfo.value = undefined

    getConversationList()
  }

  async function getConversationList() {
    conversationList.value = (await db.conversations.toArray()).reverse()
  }

  return { conversationInfo, conversationList, createConversation, updateConversationInfo, deleteConversationInfo, getConversationList }
})
