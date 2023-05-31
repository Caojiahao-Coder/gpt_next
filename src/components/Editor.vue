<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useMessageStore } from '@/store/message'
import { useConversationStore } from '@/store/conversation'
import { useEditorStore } from '@/store/editor'

const expand = ref<boolean>(false)

const { width } = useWindowSize()

const editorStore = useEditorStore()

const messageRecordsStore = useMessageStore()

const conversationStore = useConversationStore()

const inputMessage = ref<string>('')

/**
 * 展开编辑器
 */
function onExpandEditor() {
  expand.value = true
}

/**
 * 隐藏编辑器
 */
function onCloseEditor() {
  expand.value = false
}

/**
 * 发送一条新的消息
 * @param event
 */
function onSendMessage(event: KeyboardEvent) {
  event.preventDefault()
  sendNewMessage()
}

async function sendNewMessage() {
  if (editorStore.thinking === true)
    return

  const message = inputMessage.value.trim()
  inputMessage.value = ''

  // 如果没有选中Message 就需要先创建一个Message
  if (!conversationStore.conversationInfo)
    await conversationStore.createConversation()

  // 追加消息内容
  await messageRecordsStore.addNewMessage({
    role: 'user',
    content: message,
    converstaionToken: conversationStore.conversationInfo!.token!,
    conversationId: conversationStore.conversationInfo!.id!,
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })

  await messageRecordsStore.addNewMessage({
    role: 'gpt',
    content: '',
    converstaionToken: conversationStore.conversationInfo!.token!,
    conversationId: conversationStore.conversationInfo!.id!,
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
}
</script>

<template>
  <div
    class="relative color-base transition-all border-base" b="0 t-1 solid"
    :class="expand === true ? 'h-240px' : 'h-79px'"
  >
    <div
      class="flex flex-row p-24px" :class="[
        expand === true ? 'h-191px' : 'h-31px',
        expand === true ? 'bg-#f1f1f50 dark:bg-dark' : 'bg-base',
      ]"
    >
      <div v-if="width >= 1000" class="w-15%" />
      <div class="flex-1 flex flex-col">
        <div :class="expand === true ? 'h-0' : 'flex-1'" />
        <textarea
          v-model="inputMessage" :disabled="editorStore.thinking" overflow="x-hidden y-scroll"
          :placeholder="editorStore.thinking === true ? 'thinking...' : 'Enter Something...'"
          class="bg-transparent b-0 outline-none color-base text-4 h-100% p-0 m-0"
          :style="{ lineHeight: `${expand === true ? '24px' : '31px'}` }" @focus="onExpandEditor" @blur="onCloseEditor"
          @keydown.enter="onSendMessage"
        />
        <div class="flex-1" />
      </div>
      <div class="flex flex-col">
        <div class="flex-1" />
        <div class="h-31px w-31px icon-button i-carbon-send-alt" @click="sendNewMessage" />
        <div :class="expand === true ? 'h-0' : 'flex-1'" />
      </div>
      <div v-if="width >= 1000" class="w-15%" />
    </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  display: none;
}
</style>
