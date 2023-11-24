<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'
import { useI18n } from 'vue-i18n'
import { uid } from 'uid'
import EditMessageRecordTools from './EditMessageRecordTools.vue'
import Markdown from './Markdown.vue'
import type { TBMessageInfo } from '@/database/table-type'
import useMessageStore from '@/store/message-store'
import { push } from '@/main'
import { useMessageSpeechStore } from '@/store/message-speech-store'
import Dialog from '@/ui/Dialog.vue'

const props = defineProps<{
  messageInfo: TBMessageInfo
  scrollBody: () => void
}>()

const messageContent = ref<string>(props.messageInfo.user_content)

const showTools = ref<boolean>(false)

const messageInfo = ref<TBMessageInfo>(props.messageInfo)

const speeching = ref<boolean>(false)

const gptContent = ref<string>('')

const openDeleteConfirmDialog = ref<boolean>(false)

const openEditMessageDialog = ref<boolean>(false)

const messageRef = ref<HTMLDivElement>()

const { t } = useI18n()

function onMouseEnter() {
  showTools.value = true
}

function onMouseLeave() {
  showTools.value = false
}

function onReload() {
  push.info(t('please_use_the_reload_data_button_on_the_bottom_right'))
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
    status: 'finished',
    tool_call: messageInfo.value.tool_call,
    vision_file: messageInfo.value.vision_file,
  }

  openEditMessageDialog.value = false

  const messageStore = useMessageStore()
  await messageStore.updateMessageInfo(newInfo)
  messageInfo.value = newInfo
  gptContent.value = ''
}
</script>

<template>
  <div ref="messageRef">
    <div
      class="record-item user-item bg-base border-base flex flex-row gap-16px relative p-16px" b="0 b-1 solid"
      @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"
    >
      <div class="avatar w-8 h-8 b-rd-1 bg-body shadow-2xl">
        <div class="w-6 h-6 m-1 b-rd-1 i-carbon-tool-kit" />
      </div>
      <Markdown :content="messageInfo.user_content" />

      <EditMessageRecordTools
        :speeching="speeching" :show="showTools" class="top-2 right-2 absolute"
        @on-reload="onReload()" @on-delete="onDeleteConfirm()" @on-edit="openEditDialog()"
        @on-export="onExportConversation()" @on-speech="onSpeechUserMessageContent()"
      />
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
          v-model.trim="messageContent" class="flex-1 border-base outline-none bg-body color-base"
          b="1 solid rd-1" p="x-4 y-2"
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
  </div>
</template>
