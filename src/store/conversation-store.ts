import { onMounted, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { filterType } from './localstorage'
import useChatCompletionStore from './chat-completion-store'
import type { TBConverstationInfo } from '@/database/table-type'
import conversationController from '@/chat.completion/ConversationController'
import ChatCompletionHandler from '@/chat.completion/ChatCompletionHandler'

const useConversationStore = defineStore('conversationStore', () => {
  const conversationInfo = ref<TBConverstationInfo | null>(null)
  const conversationsList = ref<TBConverstationInfo[]>([])

  onMounted(() => loadConversationList())

  watch(() => filterType.value, () => {
    loadConversationList()
  })

  /**
   * 加载对话列表
   */
  function loadConversationList(): Promise<TBConverstationInfo[]> {
    conversationsList.value = []
    return new Promise<TBConverstationInfo[]>((resolve) => {
      conversationController.getConversationListAsync().then((res) => {
        let myData = res as TBConverstationInfo[]
        switch (filterType.value) {
          case 'chat':
            myData = myData.filter(a => a.type === 'chat')
            break
          case 'data':
            myData = myData.filter(a => a.type === 'dataworker')
            break
          case 'drawing':
            myData = myData.filter(a => a.type === 'draw_img_mode')
            break
        }

        myData = myData.sort((a, b) => b.create_time - a.create_time)

        conversationsList.value = myData

        resolve(myData)
      })
    })
  }

  /**
   * 更新对话列表
   */
  function updateConversationList() {
    loadConversationList()
  }

  /**
   * 设置当前的对话信息
   * @param info
   */
  function setConversationInfo(info: TBConverstationInfo | null) {
    const chatCompletionStore = useChatCompletionStore()
    conversationInfo.value = null
    chatCompletionStore.chatCompletionHandler = null

    if (info) {
      setTimeout(() => {
        conversationInfo.value = info
        const chatCompletionHandler = new ChatCompletionHandler(info)
        chatCompletionStore.chatCompletionHandler = chatCompletionHandler
      }, 10)
    }
    else {
      setTimeout(() => {
        conversationInfo.value = null
        chatCompletionStore.chatCompletionHandler = null
      }, 10)
    }
  }

  /**
   * 更新绑定的Conversation Info
   * @param conversationId
   */
  function updateConversationInfoById(conversationId: number) {
    conversationController.getConversationInfoByIdAsync(conversationId).then((res) => {
      if (res) {
        const data = res as TBConverstationInfo
        setConversationInfo(data)
      }
    })
  }

  return {
    conversationInfo,
    conversationsList,

    loadConversationList,
    updateConversationList,
    setConversationInfo,

    updateConversationInfoById,
  }
})

export default useConversationStore
