import { defineStore } from 'pinia'
import { ref } from 'vue'
import type ChatCompletionHandler from '@/chat.completion/ChatCompletionHandler'

const useChatCompletionStore = defineStore('chatCompletionStore', () => {
  const chatCompletionHandler = ref<ChatCompletionHandler | null>(null)

  return {
    chatCompletionHandler,
  }
})

export default useChatCompletionStore
