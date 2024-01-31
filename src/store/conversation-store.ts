import { onMounted, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { filterType } from './localstorage'
import type { TBConverstationInfo } from '@/database/table-type'
import conversationController from '@/chat.completion/ConversationController'

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
  function setConversationInfo(info: TBConverstationInfo) {
    if (!conversationInfo.value)
      conversationInfo.value = null

    setTimeout(() => {
      conversationInfo.value = info
    }, 10)
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
