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
import { type Message, useGlobalSettingDBStore, useMessageDBStore } from '@/store/dbstore'
import 'katex/dist/katex.min.css'
import { parserStreamText } from '@/openai/parser'

const props = defineProps<{
  messageRecordId: number
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
    .use(rehypeHighlight)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(raw)

  return String(file)
}
const answerContentRef = ref<HTMLDivElement>()

const messageDB = useMessageDBStore().db

const messageStore = useMessageStore()

const globalSettingDB = useGlobalSettingDBStore().db

const messageInfo = ref<Message>()

const content = ref<string>('')

const fullTextContent = ref<boolean>(false)

onMounted(() => {
  getMessageeItemInfo()

  if (answerContentRef.value) {
    const observer = new MutationObserver(() => {
      fullTextContent.value = (answerContentRef.value?.firstChild?.nodeName)?.toString() === '#text'
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
  if (messageInfo.value?.role === 'gpt' && messageInfo.value.content?.trim().length === 0)
    await getAnswer(messageInfo.value)
  else
    content.value = messageInfo.value!.content!
}

/**
 * 获取答案
 * @param messageInfo
 */
async function getAnswer(messageInfo: Message) {
  const existMessages = await messageDB.messages.where('converstaionToken').equalsIgnoreCase(messageInfo.converstaionToken).toArray()
  const messages: { role: string; content: string }[] = []

  existMessages.filter(a => a.id !== messageInfo.id).map(item => messages.push({
    role: item.role === 'gpt' ? 'assistant' : 'user',
    content: item.content!,
  }))

  const globalSetting = (await globalSettingDB.globalSetting.toArray())[0]

  const response = await fetchChatCompletion({
    apikey: globalSetting.openAIKey!,
    body: {
      model: globalSetting.chatModel!,
      messages,
      stream: true,
    },
  })

  /**
   * 转译stream流得到的结果
   */
  await parserStreamText(response, (contentResult: string) => {
    content.value = content.value + contentResult
  })

  await messageStore.updateMessageContent({
    id: messageInfo.id!,
    content: content.value,
    role: 'gpt',
    conversationId: messageInfo.conversationId,
    converstaionToken: messageInfo.converstaionToken,
    createTime: messageInfo.createTime,
  } as Message, messageInfo.id!)
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
      ref="answerContentRef" class="flex-1 m-l-16px conversation-content" :style="{
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
