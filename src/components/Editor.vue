<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useEditorStore from '@/store/editor-store.js'
import useConversationStore from '@/store/conversation-store'
import type { TBPromptInfo } from '@/database/table-type'
import LoadingBar from '@/ui/LoadingBar.vue'
import UploadImageList from '@/components/UploadImageList.vue'
import EditorSmartPanel from '@/components/EditorSmartPanel.vue'
import useChatCompletionStore from '@/store/chat-completion-store'
import conversationController from '@/chat.completion/ConversationController'
import type { ChatCompletionMessage } from '@/openai/type/chat.completion.message'
import { push } from '@/main'
import type ChatCompletionHandler from '@/chat.completion/ChatCompletionHandler'

const emits = defineEmits(['onSended'])

const selectedPrompt = ref<TBPromptInfo | null>(null)

const openSmartPanel = ref<boolean>(false)

const inputRef = ref<HTMLTextAreaElement>()

const editorStore = useEditorStore()

const { t } = useI18n()

const expand = ref<boolean>(false)

const { width } = useWindowSize()

const conversationStore = useConversationStore()

const inputMessage = ref<string>('')

const chatCompletionStore = useChatCompletionStore()

const visionFileList = ref<{
  fileName: string
  b64Data: string
}[]>([])

/**
 * when select new conversations, focus textarea
 */
watch(() => conversationStore.conversationInfo, (oldValue, newValue) => {
  if (inputRef.value && (!oldValue || oldValue.id !== newValue?.id))
    inputRef.value.focus()
})

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

function onKeyDown(event: KeyboardEvent) {
  const textarea = event.target as HTMLTextAreaElement
  // shift + enter
  if (event.shiftKey && event.key === 'Enter') {
    event.preventDefault()
    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    const oldValue = textarea.value
    textarea.value = `${oldValue.substring(0, startPos)}\n${oldValue.substring(endPos)}`
    textarea.selectionStart = textarea.selectionEnd = startPos + 1
  }
  // enter key
  else if (event.code === 'Enter' && event.ctrlKey !== true && event.shiftKey !== true) {
    event.preventDefault()
    if (event.isComposing)
      return
    sendNewMessage()
  }
  // input / and 、 open smart panel
  else if (!(inputMessage.value?.toString() ?? '').endsWith('/') && event.key === '/' && event.ctrlKey !== true && event.shiftKey !== true) {
    inputRef.value?.blur()
    openSmartPanel.value = true
  }
}

function onInput(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  const lastTextareaChar = textarea.value[textarea.value.length - 1]

  const otherChars = textarea.value.substring(0, textarea.value.length - 1)
  if (lastTextareaChar === '、' && (otherChars.length === 0 || !otherChars.endsWith('、')))
    openSmartPanel.value = true
}

function onClickSendMessage() {
  sendNewMessage()
}

async function sendNewMessage() {
  const message = inputMessage.value.trim()
  if (message.length === 0) {
    push.error(t('message_cannot_empty'))
    return
  }

  if (!chatCompletionStore.chatCompletionHandler) {
    initConversation().then((res) => {
      if (res.result) {
        setTimeout(() => {
          if (selectedPrompt.value && !chatCompletionStore.chatCompletionHandler?.getPromptInfo())
            chatCompletionStore.chatCompletionHandler?.setPromptInfo(selectedPrompt.value)
          pushMessage(chatCompletionStore.chatCompletionHandler as ChatCompletionHandler, message, visionFileList.value.length <= 0 ? null : visionFileList.value)
        }, 10)
      }
    })
  }
  else {
    pushMessage(chatCompletionStore.chatCompletionHandler as ChatCompletionHandler, message, visionFileList.value.length <= 0 ? null : visionFileList.value)
  }
}

async function pushMessage(chatCompletionHandler: ChatCompletionHandler, message: string, fileList: { fileName: string; b64Data: string }[] | null = null) {
  if (editorStore.thinking)
    chatCompletionHandler?.stopMessageAnswerAsync()

  const messageId = await chatCompletionHandler?.sendMessageAsync({
    content: message,
    role: 'user',
  } as ChatCompletionMessage, fileList)

  if (messageId === -1)
    push.error(t('send_message_failed'))
  else
    inputMessage.value = ''

  emits('onSended')

  visionFileList.value = []
}

async function initConversation(): Promise<{
  result: boolean
  id: number
}> {
  const result = await conversationController.createDefaultConversationAsync()
  return result
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
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 600
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
            visionFileList.value.push({
              fileName: file.name,
              b64Data: (result.target?.result ?? '') as string,
            })
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
function handlePasteImage(event: Event) {
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
    visionFileList.value.push({
      fileName: `clipboard${visionFileList.value.length + 1}.png`,
      b64Data: (result.target?.result ?? '') as string,
    })
  }
}

onMounted(() => {
  document.addEventListener('paste', event => handlePasteImage(event))
})

function clearUserUsePrompt() {
  selectedPrompt.value = null
  chatCompletionStore.chatCompletionHandler?.setPromptInfo(null)
}

function onSelectPrompt(item: TBPromptInfo) {
  selectedPrompt.value = item
  openSmartPanel.value = false
  chatCompletionStore.chatCompletionHandler?.setPromptInfo(item)
  inputMessage.value = inputMessage.value.substring(0, inputMessage.value.lastIndexOf('/'))
  setTimeout(() => {
    inputRef.value?.focus()
  }, 100)
}

function onStopResponse() {
  chatCompletionStore.chatCompletionHandler?.stopMessageAnswerAsync()
}

function removeVisionFileByIndex(index: number) {
  visionFileList.value.splice(index, 1)
}
</script>

<template>
  <div class="relative">
    <div v-if="editorStore.thinking" class="absolute top--56px w-full flex flex-row" @click="onStopResponse">
      <div
        class="flex flex-row m-auto gap-2 b-1 b-solid color-base border-base b-rd-9 bg-base p-x-4 p-y-2 cursor-pointer hover-bg-red-1 dark:hover-bg-red-9 shadow-xl transition-all"
      >
        <div class="w-22px h-22px line-height-22px i-carbon-stop" />
        <div>Stop</div>
      </div>
    </div>
    <div v-if="selectedPrompt" class="px-4 py-2 flex flex-row gap-4 bg-body select-none">
      <div v-if="selectedPrompt" class="flex flex-row line-height-24px gap-2">
        <div class="color-green m-y-12px i-carbon-checkmark-filled" />
        <div class="color-base text-4 line-height-40px">
          {{ t('use_custom_prompt') }}
        </div>
        <div class="prompt-item-title color-base b-rd-90 px-4 p-r-46px line-height-40px flex flex-row relative">
          <div class="color-white font-bold">
            {{ selectedPrompt?.title ?? "" }}
          </div>
          <div
            class="bg-white b-rd-90 w-28px h-28px m-y-5px absolute right-5px hover-bg-red transition-all hover-color-white color-red b-1px b-solid border-white"
            @click="clearUserUsePrompt"
          >
            <div class="i-carbon-close w-24px h-24px m-2px" />
          </div>
        </div>
      </div>
    </div>

    <div class="b-0 b-t-1 b-b-1 border-base border-solid flex flex-row gap-2 p-2">
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

    <EditorSmartPanel
      :open="openSmartPanel" :on-close-callback="() => openSmartPanel = false"
      @on-close-smart-panel="() => openSmartPanel = false" @on-select-prompt="(item) => onSelectPrompt(item)"
    />

    <UploadImageList
      :vision-file-list="visionFileList"
      @delete-file-by-index="(index) => removeVisionFileByIndex(index)"
    />

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
            ref="inputRef" v-model="inputMessage" data-cursor="text" overflow="x-hidden y-scroll"
            :placeholder="t('enter')" class="bg-transparent b-0 outline-none color-base text-4 h-100% p-0 m-0"
            :style="{ lineHeight: `${expand === true ? '24px' : '31px'}` }" @focus="onExpandEditor" @blur="onCloseEditor"
            @keydown="onKeyDown" @input="onInput"
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

.prompt-item-title {
  background: linear-gradient(221deg, rgba(255, 0, 0, 0.50) 17.49%, rgba(255, 245, 0, 0.34) 85.01%), linear-gradient(115deg, rgba(255, 199, 0, 0.60) 34.42%, rgba(0, 255, 194, 0.60) 100%), linear-gradient(251deg, rgba(255, 0, 0, 0.60) 0%, rgba(191, 7, 255, 0.60) 100%);
}
</style>
