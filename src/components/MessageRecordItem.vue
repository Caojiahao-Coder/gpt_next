<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import html2canvas from 'html2canvas'
import { uid } from 'uid'
import EditMessageRecordTools from './EditMessageRecordTools.vue'
import type { TBMessageInfo } from '@/database/table-type'
import Markdown from '@/components/Markdown.vue'
import useMessageStore from '@/store/message-store'
import { handleChatCompletions } from '@/openai/handler'
import { fetchChatCompletion } from '@/openai/api'
import useGlobalStore from '@/store/global-store'
import { parserStreamText } from '@/openai/parser'
import useEditorStore from '@/store/editor-store'
import Dialog from '@/ui/Dialog.vue'
import { useErrorDialogStore } from '@/store/error-dialog'
import { useMessageSpeechStore } from '@/store/message-speech-store'
import { push } from '@/main'

const props = defineProps<{
  messageInfo: TBMessageInfo
  scrollBody: () => void
}>()

const editorStore = useEditorStore()

const messageStore = useMessageStore()

const showTools = ref<boolean>(false)

const openDeleteConfirmDialog = ref<boolean>(false)

const openEditMessageDialog = ref<boolean>(false)

const messageContent = ref<string>(props.messageInfo.user_content)

const messageRef = ref<HTMLDivElement>()

const { t } = useI18n()

const messageInfo = ref<TBMessageInfo>(props.messageInfo)

const gptContent = ref<string>('')

const errorDialogStore = useErrorDialogStore()

const speeching = ref<boolean>(false)

const gptMessageSpeechStatus = ref<'pending' | 'processing' | 'finished'>('finished')

onMounted(() => {
  /**
   * 需要请求结果
   */
  if (messageInfo.value.status === 'waiting')
    getChatAnswer()

  else
    gptContent.value = messageInfo.value.gpt_content
})

/**
 * 获取对话结果
 */
async function getChatAnswer() {
  editorStore.thinking = true

  const messageData: {
    role: string
    content: string
  }[] = []

  const data = await messageStore.getMessageRecordsByConversationId(messageInfo.value.conversation_id)

  data.filter(a => a.conversation_id === messageInfo.value!.conversation_id && a.id <= messageInfo.value!.id).map((a) => {
    messageData.push({
      role: 'user',
      content: a.user_content,
    })

    if (a.gpt_content.trim().length !== 0 && a.id !== messageInfo.value.id) {
      messageData.push({
        role: 'assistant',
        content: a.gpt_content,
      })
    }
    return messageData
  })

  const messagesBody = handleChatCompletions(messageData)

  const globalStore = useGlobalStore()
  const globalSettingInfo = await globalStore.getGlobalSetting()

  try {
    const response = await fetchChatCompletion({
      apikey: globalSettingInfo.api_key,
      body: {
        model: globalSettingInfo.chat_model,
        top_p: 1,
        temperature: 0.7,
        messages: messagesBody,
        stream: true,
      },
    })

    await parserStreamText(response, (content) => {
      gptContent.value = gptContent.value + content
      props.scrollBody()
    }, (error) => {
      gptContent.value = error.error.message
    })

    setAnswerToMessageItem(gptContent.value, 'finished')

    if (messageStore.messageList.length === 1) {
      setTimeout(() => {
        messageStore.createSessionTitle()
      }, 120)
    }
  }
  catch (error) {
    setAnswerToMessageItem(String(error), 'error')

    errorDialogStore.message = `Error occurred: ${error}`
    errorDialogStore.showErrorDialog = true
    editorStore.thinking = false
  }
}

async function setAnswerToMessageItem(content: string, status: 'finished' | 'error' | 'waiting') {
  const info: TBMessageInfo = {
    id: messageInfo.value.id,
    conversation_id: messageInfo.value.conversation_id,
    token_id: messageInfo.value.token_id,
    user_content: messageInfo.value.user_content,
    gpt_content: content,
    create_time: messageInfo.value.create_time,
    status,
  }

  await messageStore.updateMessageInfo(info)
  gptContent.value = content
  messageInfo.value = info
  editorStore.thinking = false
  messageStore.messageList = await messageStore.getMessageRecordsByConversationId(props.messageInfo.conversation_id)
}

function onMouseEnter() {
  showTools.value = true
}

function onMouseLeave() {
  showTools.value = false
}

function onReload() {
  gptContent.value = ''
  getChatAnswer()
}

function onDeleteConfirm() {
  openDeleteConfirmDialog.value = true
}

async function onDelete() {
  const messageStore = useMessageStore()
  openDeleteConfirmDialog.value = false
  await messageStore.deleteMessageItem(messageInfo.value.id)
  messageStore.messageList = []
  messageStore.messageList = await messageStore.getMessageRecordsByConversationId(messageInfo.value.conversation_id)
}

function openEditDialog() {
  openEditMessageDialog.value = true
}

async function onSubmitEditMessage() {
  const message = messageContent.value.trim()
  if (message.length === 0) {
    push.error(t('message_cannot_empty'))
    return
  }

  const newInfo: TBMessageInfo = {
    id: messageInfo.value.id,
    conversation_id: messageInfo.value.conversation_id,
    token_id: messageInfo.value.token_id,
    user_content: message,
    gpt_content: '',
    create_time: messageInfo.value.create_time,
    status: 'waiting',
  }

  openEditMessageDialog.value = false

  const messageStore = useMessageStore()
  await messageStore.updateMessageInfo(newInfo)
  messageInfo.value = newInfo
  gptContent.value = ''

  getChatAnswer()
}

function onExportConversation() {
  if (!messageRef.value) {
    push.error(t('export-failed'))
    return
  }

  html2canvas(messageRef.value!, {
    allowTaint: true,
  }).then((canvas: HTMLCanvasElement) => {
    const downloadLink = document.createElement('a')
    downloadLink.href = canvas.toDataURL()
    downloadLink.download = uid(32)
    downloadLink.click()
  })
}

/**
 * 阅读聊天内容
 */
function onSpeechUserMessageContent() {
  speeching.value = true
  useMessageSpeechStore().playMessage(messageContent.value ?? '', status =>
    speeching.value = !(status === 'finished'),
  )
}

function onSpeechGPTMessageContent() {
  useMessageSpeechStore().playMessage(gptContent.value ?? '', status => gptMessageSpeechStatus.value = status)
}
</script>

<template>
  <div ref="messageRef">
    <div
      class="record-item user-item bg-base border-base flex flex-row gap-16px relative" b="0 b-1 solid"
      @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"
    >
      <div class="avatar w-8 h-8 b-rd-1 bg-body">
        <div class="w-6 h-6 m-1 b-rd-1" i-carbon-user />
      </div>
      <Markdown :content="messageInfo.user_content" />

      <EditMessageRecordTools
        :speeching="speeching" :show="showTools" class="top-2 right-2 absolute"
        @on-reload="onReload()" @on-delete="onDeleteConfirm()" @on-edit="openEditDialog()"
        @on-export="onExportConversation()" @on-speech="onSpeechUserMessageContent()"
      />
    </div>
    <div class="record-item gpt-item bg-body border-base flex flex-row gap-16px relative" b="0 b-1 solid">
      <div class="avatar w-8 h-8 b-rd-1">
        <div class="w-6 h-6 m-1 b-rd-1" i-carbon-bot />
      </div>
      <Markdown :content="gptContent" :class="messageInfo.status === 'error' ? 'color-red' : ''" />
      <div
        class="icon-button absolute bottom-2 right-2 text-4" :class="[
          gptMessageSpeechStatus === 'finished' ? 'i-carbon-voice-activate'
          : gptMessageSpeechStatus === 'processing' ? 'i-svg-spinners-gooey-balls-1' : 'i-svg-spinners-180-ring',
        ]" @click="onSpeechGPTMessageContent"
      />
    </div>
  </div>

  <Dialog
    :open="openDeleteConfirmDialog" :title="t('dialog_delete_confirm_title')" @on-close="() => {
      openDeleteConfirmDialog = false
    }"
  >
    <div color-red>
      {{ t('session_clear_warning') }}
    </div>

    <div flex flex-row gap-2 m-t-2>
      <div flex-1 />
      <button
        class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
        @click="onDelete()"
      >
        {{ t('delete') }}
      </button>
      <button
        class="bg-body color-base outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2" @click="() => {
          openDeleteConfirmDialog = false
        }"
      >
        {{ t('cancel') }}
      </button>
    </div>
  </Dialog>

  <Dialog
    :open="openEditMessageDialog" :title="t('dialog_edit_title')" @on-close="() => {
      openEditMessageDialog = false
    }"
  >
    <div flex flex-row>
      <textarea
        v-model.trim="messageContent" class="flex-1 border-base outline-none bg-body color-base" b="1 solid rd-1"
        p="x-4 y-2"
      />
    </div>
    <div flex flex-row m-t-4 gap-2>
      <div flex-1 />
      <button
        class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
        @click="onSubmitEditMessage()"
      >
        {{ t('submit') }}
      </button>
      <button
        class="bg-body color-base outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2" @click="() => {
          openEditMessageDialog = false
        }"
      >
        {{ t('cancel') }}
      </button>
    </div>
  </Dialog>
</template>

<style scoped>
.record-item {
  padding: 16px;
}

.gpt-item>.avatar>div {
  background: linear-gradient(24deg, #2a2dce 0%, rgba(247, 0, 208, 0.890484) 100%);
}

.gpt-item {
  background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%204096%204096%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22x37ws8lk43i60c%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221%22%20numOctaves%3D%222.8%22%20stitchTiles%3D%22stitch%22%20%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23x37ws8lk43i60c)%22%20opacity%3D%220.1%22%20%2F%3E%3C%2Fsvg%3E');
}
</style>
