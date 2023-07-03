<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useEditorStore from '@/store/editor-store.js'
import { useErrorDialogStore } from '@/store/error-dialog'
import Message from '@/ui/message'
import useMessageStore from '@/store/message-store'
import useConversationStore from '@/store/conversation-store'
import useGlobalStore from '@/store/global-store'
import { uid } from 'uid'
import type { NewMessageInfo } from '@/database/table-type'

const editorStore = useEditorStore()

const { t } = useI18n()

const expand = ref<boolean>(false)

const { width } = useWindowSize()

const conversationStore = useConversationStore()

const inputMessage = ref<string>('')

const errorDialogStore = useErrorDialogStore()

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
function onKeyDownEnter(event: KeyboardEvent) {
  event.preventDefault()
  sendNewMessage()
}

function onClickSendMessage() {
  sendNewMessage()
}

async function sendNewMessage() {
  const messageStore = useMessageStore()

  if (editorStore.thinking === true)
    return

  const message = inputMessage.value.trim()

  if (message.length === 0) {
    Message.error(t('message_cannot_empty'))
    return
  }

  const globalSettingStore = useGlobalStore()
  const globalSettingInfo = await globalSettingStore.getGlobalSetting()

  if (!globalSettingInfo) {
    errorDialogStore.message = t('message_apikey_empty')
    errorDialogStore.showErrorDialog = true
    return
  }

  let conversationId = -1

  if (!conversationStore.conversationInfo) {
    conversationId = await conversationStore.createNewConversation({
      title: t('new_conversation_title'),
      color: 'bg-gray',
      create_time: Date.now(),
      description: '',
      conversation_token: uid(32)
    })
  }
  else {
    conversationId = conversationStore.conversationInfo.id
  }

  const messageInfo: NewMessageInfo = {
    conversation_id: conversationId,
    user_content: message,
    gpt_content: '',
    create_time: Date.now(),
    token_id: uid(32),
    status: 'waiting'
  }

  messageStore.addNewMessage(messageInfo)

  //  editorStore.thinking = true

  inputMessage.value = ''
}
</script>

<template>
  <div class="relative color-base transition-all border-base" b="0 t-1 solid" :class="[
    expand === true ? 'h-240px' : 'h-79px',
  ]">
    <div class="flex flex-row p-24px" :class="[
      expand === true ? 'h-191px' : 'h-31px',
    ]">
      <div v-if="width >= 1000" class="w-15%" />
      <div class="flex-1 flex flex-col">
        <div :class="expand === true ? 'h-0' : 'flex-1'" />
        <textarea v-model="inputMessage" :disabled="editorStore.thinking" overflow="x-hidden y-scroll"
          :placeholder="editorStore.thinking === true ? t('thinking') : t('enter')"
          class="bg-transparent b-0 outline-none color-base text-4 h-100% p-0 m-0"
          :style="{ lineHeight: `${expand === true ? '24px' : '31px'}` }" @focus="onExpandEditor" @blur="onCloseEditor"
          @keydown.enter="onKeyDownEnter" />
        <div class="flex-1" />
      </div>
      <div class="flex flex-col">
        <div class="flex-1" />
        <div class="h-31px w-31px icon-button i-carbon-send-alt" @click="onClickSendMessage" />
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
