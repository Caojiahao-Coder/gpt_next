<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { uid } from 'uid'
import useEditorStore from '@/store/editor-store.js'
import { useErrorDialogStore } from '@/store/error-dialog'
import useMessageStore from '@/store/message-store'
import useConversationStore from '@/store/conversation-store'
import useGlobalStore from '@/store/global-store'
import type { NewMessageInfo } from '@/database/table-type'
import LoadingBar from '@/ui/LoadingBar.vue'
import { push } from '@/main'
import useOpenAIVisionStore from '@/store/openai-vision-store'
import UploadImageList from '@/components/UploadImageList.vue'

const editorStore = useEditorStore()

const { t } = useI18n()

const expand = ref<boolean>(false)

const { width } = useWindowSize()

const conversationStore = useConversationStore()

const inputMessage = ref<string>('')

const errorDialogStore = useErrorDialogStore()

const openAIVisionStore = useOpenAIVisionStore()

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
  if (event.isComposing)
    return

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
    push.error(t('message_cannot_empty'))
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
      conversation_token: uid(32),
      type: 'chat',
    })
  }
  else {
    conversationId = conversationStore.conversationInfo.id
  }

  const visionFileList: {
    file_name: string
    b64_data: string
  }[] = []

  for (const item of openAIVisionStore.fileList) {
    visionFileList.push({
      file_name: item.fileName,
      b64_data: item.fileData,
    })
  }

  const messageInfo: NewMessageInfo = {
    conversation_id: conversationId,
    user_content: message,
    gpt_content: '',
    create_time: Date.now(),
    token_id: uid(32),
    status: 'waiting',
    vision_file: openAIVisionStore.fileList.length <= 0
      ? undefined
      : JSON.stringify(visionFileList),
  }

  openAIVisionStore.clearUploadFileList()

  messageStore.addNewMessage(messageInfo)

  editorStore.thinking = true

  inputMessage.value = ''
}

function uploadVisionFiles() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.click()

  input.addEventListener('change', (event) => {
    const files = (event.target as HTMLInputElement).files

    if ((files?.length ?? 0) <= 0)
      return

    uploadImageFile(files as FileList)
  })
}

async function uploadImageFile(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader()
    const file = files[i]
    reader.readAsDataURL(file)
    reader.onloadend = function (result) {
      const img = new Image()
      img.onload = function () {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const MAX_WIDTH = 600
        const MAX_HEIGHT = 400
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        }
        else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        ctx!.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          const reader = new FileReader()
          reader.onloadend = function (result) {
            openAIVisionStore.uploadImageFile(file.name, (result.target?.result ?? '') as string)
          }
          reader.readAsDataURL(blob! as Blob)
        }, 'image/jpeg', 0.7) // 0.7 is the quality factor
      }
      img.src = (result.target?.result ?? '') as string
    }
  }
}

/**
 * 从剪切板粘贴图片
 */
function handlePasteImage() {
  const items = (event as ClipboardEvent).clipboardData?.items

  if (!items)
    return

  const item = items[0]

  if (!item.type.includes('image'))
    return

  const blob = item.getAsFile()

  if (!blob)
    return

  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = function (result) {
    openAIVisionStore.uploadImageFile(`clipboard${openAIVisionStore.fileList.length + 1}.png`, (result.target?.result ?? '') as string)
  }
}

onMounted(() => {
  document.addEventListener('paste', handlePasteImage)
})
</script>

<template>
  <div>
    <div v-if="openAIVisionStore.fileList.length >= 1" class="px-4 py-2 flex flex-row gap-2 bg-body select-none">
      <div v-if="openAIVisionStore.fileList.length >= 1" class="flex flex-row line-height-24px gap-2">
        <div class="color-green m-4px i-carbon-checkmark-filled" />
        <div class="color-base text-4">
          {{ t('use_gpt_vision_api') }}
        </div>
      </div>
    </div>

    <div class="b-0 b-t-1 border-base border-solid flex flex-row gap-2 p-2">
      <div v-if="width >= 1000" class="w-15%" />

      <div
        class="bg-body border-1 b-rd border-solid border-base p2 icon-button flex flex-row gap-2 cursor-pointer"
        @click="uploadVisionFiles"
      >
        <div class="i-carbon-visual-recognition w-22px h-22px color-base" />
        <div class="color-base font-light">
          {{ t('vision') }}
        </div>
      </div>

      <div v-if="width >= 1000" class="w-15%" />
    </div>

    <UploadImageList />

    <div
      class="relative color-base transition-all b-0 b-t-1" :class="[
        expand === true ? 'h-240px' : 'h-80px',
      ]"
    >
      <LoadingBar />
      <div
        class="flex flex-row p-24px" :class="[
          expand === true ? 'h-191px' : 'h-31px',
        ]"
      >
        <div v-if="width >= 1000" class="w-15%" />
        <div class="flex-1 flex flex-col">
          <div :class="expand === true ? 'h-0' : 'flex-1'" />
          <textarea
            v-model="inputMessage" data-cursor="text" :disabled="editorStore.thinking"
            overflow="x-hidden y-scroll" :placeholder="editorStore.thinking === true ? t('thinking') : t('enter')"
            class="bg-transparent b-0 outline-none color-base text-4 h-100% p-0 m-0"
            :style="{ lineHeight: `${expand === true ? '24px' : '31px'}` }" @focus="onExpandEditor" @blur="onCloseEditor"
            @keydown.enter="onKeyDownEnter"
          />
          <div class="flex-1" />
        </div>
        <div class="flex flex-col">
          <div class="flex-1" />
          <div data-cursor="block" class="h-31px w-31px icon-button i-carbon-send-alt" @click="onClickSendMessage" />
          <div :class="expand === true ? 'h-0' : 'flex-1'" />
        </div>
        <div v-if="width >= 1000" class="w-15%" />
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  display: none;
}
</style>
