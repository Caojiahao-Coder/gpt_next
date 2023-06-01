<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeHighlight from 'rehype-highlight'
import { fetchChatCompletion } from '@/openai/api'
import { useMessageStore } from '@/store/message'
import { type Message, useMessageDBStore } from '@/store/dbstore'
import 'katex/dist/katex.min.css'
import { parserStreamText } from '@/openai/parser'
import { useEditorStore } from '@/store/editor'
import type { MessageResultType } from '@/openai/message-type'
import { useConversationStore } from '@/store/conversation'
import { handleChatCompletions } from '@/openai/handler'
import { useGlobalSettingStore } from '@/store/globalsetting'

const props = defineProps<{
  messageRecordId: number
  scrollBody: () => void
}>()

/**
 * markdown text to html element
 * @param raw
 */
function parseMarkdown(raw: string) {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism, {
      ignoreMissing: true,
    })
    .use(rehypeHighlight, { detect: true })
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(raw)

  return String(file)
}
const answerContentRef = ref<HTMLDivElement>()

const messageDB = useMessageDBStore().db

const messageStore = useMessageStore()

const messageInfo = ref<Message>()

const content = ref<string>('')

const fullTextContent = ref<boolean>(false)

const globalSettingStore = useGlobalSettingStore()

const error = ref<boolean>(false)

onMounted(() => {
  getMessageeItemInfo()

  if (answerContentRef.value) {
    const observer = new MutationObserver(() => {
      fullTextContent.value = (answerContentRef.value?.firstChild?.nodeName)?.toString() === '#text'
      props.scrollBody()
    })
    observer.observe(answerContentRef.value, {
      childList: true,
    })
  }
})

/**
 * 获取消息信息
 */
async function getMessageeItemInfo() {
  messageInfo.value = await messageDB.messages.get(props.messageRecordId)!

  // 如果回答属于机器人回答 并且Content为空 那就需要去请求答案
  if (messageInfo.value?.role === 'gpt' && messageInfo.value.content?.trim().length === 0) {
    await getAnswer(messageInfo.value)
  }
  else {
    content.value = messageInfo.value!.content!
    error.value = messageInfo.value!.error
  }
}

/**
 * 获取答案
 * @param messageInfo
 */
async function getAnswer(messageInfo: Message) {
  const globalSettingInfo = await globalSettingStore.getGlobalSetting()

  if (!globalSettingInfo)
    return

  const editorStore = useEditorStore()
  editorStore.thinking = true
  const existMessages = await messageDB.messages.where('converstaionToken').equalsIgnoreCase(messageInfo.converstaionToken).toArray()
  const messages: { role: string; content: string }[] = []

  existMessages.filter(a => a.id !== messageInfo.id).map(item => messages.push({
    role: item.role === 'gpt' ? 'assistant' : 'user',
    content: item.content!,
  }))

  const response = await fetchChatCompletion({
    apikey: globalSettingInfo.apiKey,
    body: {
      model: globalSettingInfo.gptModel,
      messages: handleChatCompletions(messages),
      stream: true,
    },
  })

  /**
   * 转译stream流得到的结果
   */
  await parserStreamText(response, (contentResult: string) => {
    content.value = content.value + contentResult
  }, (data: {
    error: {
      message: string
      type: string
      param: string
      code: string
    }
  }) => {
    content.value = data.error.message.length === 0 ? data.error.code : data.error.message
    error.value = true
  })

  await messageStore.updateMessageContent({
    id: messageInfo.id!,
    content: content.value,
    role: 'gpt',
    conversationId: messageInfo.conversationId,
    converstaionToken: messageInfo.converstaionToken,
    createTime: messageInfo.createTime,
    error: error.value,
  } as Message, messageInfo.id!)
  editorStore.thinking = false

  if (messageStore.messageRecords.length === 2)
    getConversationName()
}

async function getConversationName() {
  const globalSettingInfo = await globalSettingStore.getGlobalSetting()

  if (!globalSettingInfo)
    return

  const messages: { role: string; content: string }[] = []
  messageStore.messageRecords.map(a => messages.push({
    role: a.role === 'gpt' ? 'assistant' : 'user',
    content: a.content!,
  }))

  messages.push({
    role: 'user',
    content: 'Please give this message a title of no more than 8 characters based on the current conversation. (in Chinese)',
  })

  fetchChatCompletion({
    apikey: globalSettingInfo.apiKey,
    body: {
      model: globalSettingInfo.gptModel,
      messages: handleChatCompletions(messages),
    },
  }).then((response) => {
    response.json().then((result: MessageResultType) => {
      const conversationStore = useConversationStore()
      const info = conversationStore.conversationInfo
      conversationStore.updateConversationInfo(conversationStore.conversationInfo!.id!, {
        id: info!.id,
        name: result.choices[0].message.content,
        token: info!.token,
        model: info!.model,
        createTime: info!.createTime,
        color: info!.color,
        description: info!.description,
      })
    })
  })
}
</script>

<template>
  <div
    class="p-6 border-base flex flex-row" b="0 b-1 solid" :class="[
      messageInfo?.role === 'user' ? 'bg-base' : 'bg-body',
      messageInfo?.role,
    ]"
  >
    <div class="avatar w-8 h-8 b-rd-1">
      <div
        class="w-22px h-22px m-5px color-#f1f1f1"
        :class="messageInfo?.role === 'user' ? 'i-carbon-user' : 'i-carbon-chat-bot'"
      />
    </div>
    <div
      ref="answerContentRef" class="flex-1 m-l-16px conversation-content"
      :class="error === true ? 'color-red' : ''"
      :style="{
        marginTop: `${fullTextContent === true ? '' : '-1rem'}`,
        marginBottom: `${fullTextContent === true ? '' : '-1rem'}`,
      }" v-html="parseMarkdown(content)"
    />
  </div>
</template>

<style scoped>
.user>.avatar {
  background-color: #33333380;
}

.gpt>.avatar {
  background: linear-gradient(135deg, #2A6CCE 0%, rgba(247, 0, 208, 0.890484) 100%);
}

.conversation-content {
  line-height: 32px;
  overflow: hidden;
  word-wrap: break-word;
}

.conversation-content>* {
  position: absolute;
}
</style>
