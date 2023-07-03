<script setup lang="ts">
import { ref } from 'vue'
import type { TBMessageInfo } from '@/database/table-type';
import Markdown from '@/components/Markdown.vue'
import { onMounted } from 'vue';
import useMessageStore from '@/store/message-store';
import { handleChatCompletions } from '@/openai/handler';
import { fetchChatCompletion } from '@/openai/api';
import useGlobalStore from '@/store/global-store';
import { parserStreamText } from '@/openai/parser';
import useEditorStore from '@/store/editor-store';

const props = defineProps<{
  messageInfo: TBMessageInfo,
  scrollBody: () => void
}>()

const editorStore = useEditorStore()

const messageInfo = ref<TBMessageInfo>(props.messageInfo)
const gptContent = ref<string>('')

onMounted(() => {
  /**
   * 需要请求结果
   */
  if (messageInfo.value.status === 'waiting') {
    editorStore.thinking = true
    getChatAnswer()
  } else {
    gptContent.value = messageInfo.value.gpt_content
  }
})

/**
 * 获取对话结果
 */
async function getChatAnswer() {
  const messageStore = useMessageStore();

  const messageData: {
    role: string,
    content: string
  }[] = []

  messageStore.messageList.filter(a => a.conversation_id === messageInfo.value!.conversation_id).map(a => {
    messageData.push({
      role: 'user',
      content: a.user_content
    })

    if (a.gpt_content.trim().length !== 0) {
      messageData.push({
        role: 'assistant',
        content: a.gpt_content
      })
    }
    return messageData
  })

  var messagesBody = handleChatCompletions(messageData)

  const globalStore = useGlobalStore()
  const globalSettingInfo = await globalStore.getGlobalSetting()

  const response = await fetchChatCompletion({
    apikey: globalSettingInfo.api_key,
    body: {
      model: globalSettingInfo.chat_model,
      top_p: 1,
      temperature: 0.7,
      max_tokens: 2048,
      messages: handleChatCompletions(messagesBody),
      stream: true,
    },
  })

  await parserStreamText(response, (content) => {
    gptContent.value = gptContent.value + content
    props.scrollBody()
  }, (error) => {
    gptContent.value = error.error.message
  })

  const info: TBMessageInfo = {
    id: props.messageInfo.id,
    conversation_id: props.messageInfo.conversation_id,
    token_id: props.messageInfo.token_id,
    user_content: props.messageInfo.user_content,
    gpt_content: gptContent.value,
    create_time: props.messageInfo.create_time,
    status: 'finished'
  }

  messageStore.updateMessageInfo(info)

  messageInfo.value = info;
  editorStore.thinking = false
}

</script>
<template>
  <div class="record-item user-item bg-base border-base flex flex-row gap-16px" b="0 b-1 solid">
    <div class="avatar w-8 h-8 b-rd-1 bg-body">
      <div class="w-6 h-6 m-1" i-carbon-user />
    </div>
    <Markdown :content="messageInfo.user_content" />
  </div>
  <div class="record-item gpt-item bg-body border-base flex flex-row gap-16px" b="0 b-1 solid">
    <div class="avatar w-8 h-8 b-rd-1">
      <div class="w-6 h-6 m-1" i-carbon-bot />
    </div>
    <Markdown :content="gptContent" />
  </div>
</template>

<style scoped>
.record-item {
  padding: 16px;
}

.gpt-item>.avatar>div {
  background: linear-gradient(24deg, #2A6CCE 0%, rgba(247, 0, 208, 0.890484) 100%);
}
</style>
