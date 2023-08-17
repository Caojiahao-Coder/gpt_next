import { ref } from 'vue'
import { defineStore } from 'pinia'
import useGlobalStore from './global-store'
import useConversationStore from './conversation-store'
import db from '@/database/db'
import type { NewMessageInfo, TBMessageInfo } from '@/database/table-type'
import { handleCreateSessionNameByGPT } from '@/openai/handler'
import { fetchChatCompletion } from '@/openai/api'
import { parserStreamText } from '@/openai/parser'

const useMessageStore = defineStore('messageStore', () => {
  const messageList = ref<TBMessageInfo[]>([])

  function getMessageRecordsByConversationId(conversationId: number): Promise<TBMessageInfo[]> {
    // eslint-disable-next-line promise/param-names
    return new Promise((reslove) => {
      db.init().then(() => {
        db.select('tb_message', 'conversation_id', conversationId).then((res) => {
          reslove(res as TBMessageInfo[])
        })
      })
    })
  }

  function addNewMessage(data: NewMessageInfo) {
    db.init().then(() => {
      db.add('tb_message', data).then(() => {
        getMessageRecordsByConversationId(data.conversation_id).then((res) => {
          messageList.value = res
        })
      })
    })
  }

  function updateMessageInfo(data: TBMessageInfo): Promise<boolean> {
    // eslint-disable-next-line promise/param-names
    return new Promise((reslove) => {
      db.init().then(async () => {
        await db.update('tb_message', data)
        reslove(true)
      })
    })
  }

  async function clearRecords() {
    db.init().then(() => {
      messageList.value.forEach((item) => {
        db.deleteById('tb_message', item.id)
      })
      clearMessageRecords()
    })
  }

  function clearMessageRecords() {
    messageList.value = []
  }

  function deleteMessageItem(id: number): Promise<boolean> {
    // eslint-disable-next-line promise/param-names
    return new Promise((reslove) => {
      db.init().then(async () => {
        await db.deleteById('tb_message', id)
        reslove(true)
      })
    })
  }

  async function createSessionTitle() {
    const messageData: { role: string; content: string }[] = []
    messageList.value.map((a) => {
      messageData.push({
        role: 'user',
        content: a.user_content,
      })

      if (a.gpt_content.trim().length !== 0) {
        messageData.push({
          role: 'assistant',
          content: a.gpt_content,
        })
      }
      return messageData
    })

    const globalStore = useGlobalStore()
    const globalSettingInfo = await globalStore.getGlobalSetting()

    const response = await fetchChatCompletion({
      apikey: globalSettingInfo.api_key,
      body: {
        model: globalSettingInfo.chat_model,
        top_p: 1,
        temperature: 0.7,
        max_tokens: 2048,
        messages: handleCreateSessionNameByGPT(messageData),
        stream: true,
      },
    })

    let sessionTitle = ''

    await parserStreamText(response, (content) => {
      sessionTitle += content
    }, () => {})

    const converstationStore = useConversationStore()

    converstationStore.updateConversationInfoById({
      id: converstationStore.conversationInfo!.id,
      title: sessionTitle,
      description: converstationStore.conversationInfo!.description,
      color: converstationStore.conversationInfo!.color,
      create_time: converstationStore.conversationInfo!.create_time,
      conversation_token: converstationStore.conversationInfo!.conversation_token,
      fixed_top: converstationStore.conversationInfo!.fixed_top ?? false,
    })
  }

  return {
    messageList,
    getMessageRecordsByConversationId,
    addNewMessage,
    updateMessageInfo,
    clearMessageRecords,
    clearRecords,
    deleteMessageItem,
    createSessionTitle,
  }
})

export default useMessageStore
