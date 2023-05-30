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
import hljs from 'highlight.js'
import { type MessageResultByStreamType } from '@/openai/message-type'
import { fetchChatCompletion } from '@/openai/api'
import { useMessageStore } from '@/store/message'
import { type Message, useGlobalSettingDBStore, useMessageDBStore } from '@/store/dbstore'
import 'katex/dist/katex.min.css'

const props = defineProps<{
  messageRecordId: number
}>()

function parseMarkdown(raw: string) {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism, {
      ignoreMissing: true,
    })
    .use(rehypeHighlight, { highlighter: hljs.highlight })
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(raw)
  return String(file)
}

const messageDB = useMessageDBStore().db

const messageStore = useMessageStore()

const globalSettingDB = useGlobalSettingDBStore().db

const messageInfo = ref<Message>()

const content = ref<string>('')

onMounted(() => {
  getMessageeItemInfo()
})

async function getMessageeItemInfo() {
  messageInfo.value = await messageDB.messages.get(props.messageRecordId)!

  if (messageInfo.value?.role === 'gpt' && messageInfo.value.content?.trim().length === 0)
    await getAnswer(messageInfo.value)
  else
    content.value = messageInfo.value!.content!
}

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

  const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
  if (!reader)
    return

  while (true) {
    const { value, done } = await reader.read()
    if (done)
      break
    let dataDone = false
    const arr = value.split('\n')
    arr.forEach((data) => {
      if (data.length === 0)
        return
      if (data.startsWith(':'))
        return
      if (data === 'data: [DONE]') {
        dataDone = true
        return
      }
      const json = JSON.parse(data.substring(6)) as MessageResultByStreamType
      const messageItem = json.choices[0].delta.content
      if (messageItem)
        content.value = content.value + messageItem
    })
    if (dataDone)
      break
  }

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
      <div class="w-22px h-22px m-5px color-#f1f1f1" :class="messageInfo?.role === 'user' ? 'i-carbon-user' : 'i-carbon-chat-bot'" />
    </div>
    <div
      class="flex-1 m-l-16px conversation-content" style="margin-top: -1rem;margin-bottom: -1rem;"
      v-html="parseMarkdown(content)"
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
  position: relative;
  line-height: 32px;
  overflow: hidden;
  word-wrap: break-word;
}

.conversation-content>* {
  position: absolute;
}
</style>
