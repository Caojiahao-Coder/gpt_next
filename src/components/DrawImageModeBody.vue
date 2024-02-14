<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref, watch } from 'vue'
import { uid } from 'uid'
import { push } from '@/main'
import type { NewMessageInfo, TBMessageInfo } from '@/database/table-type'
import Dialog from '@/ui/Dialog.vue'
import useChatCompletionStore from '@/store/chat-completion-store'
import messageController from '@/chat.completion/MessageController'
import openAIServices from '@/openai/logic/services'
import { ImageGenerationParser, defaultData } from '@/openai/parser/ImageGenerationParser'

const chatCompletionHandler = useChatCompletionStore().chatCompletionHandler

const showImgPrompt = ref<boolean>(false)

const { t } = useI18n()

const canvasRef = ref<HTMLDivElement>()

const prompt = ref<string>()

const loadingImg = ref<boolean>(false)

const canvasSize = ref<number>(0)

const imagesList = ref<TBMessageInfo[]>([])

const curIndex = ref<number>(0)

const imgStyle = ref<'vivid' | 'natural'>('natural')

const openDeleteConfirmDialog = ref<boolean>(false)

const openEditTools = ref<boolean>(false)

const isErrorItem = ref<boolean>(false)

const errorMessage = ref<string>('')

const imgPrompt = ref<string>('')

onMounted(() => {
  loadImgList()
  window.onresize = onCanvasReSize
  onCanvasReSize()
})

async function loadImgList() {
  const result = await messageController.getMessageByConversationIdAsync(chatCompletionHandler?.getConversationInfo().id ?? -1)
  imagesList.value = result
  curIndex.value = result.length - 1
  if (imagesList.value.length < 1)
    canvasRef.value!.style.backgroundImage = 'url("")'
  else
    bindNewImg()
}

watch(curIndex, () => {
  curIndex.value = Math.max(curIndex.value, 0)
  curIndex.value = Math.min(imagesList.value.length - 1, curIndex.value)
  bindNewImg()
})

function bindNewImg() {
  if (imagesList.value.length < 1)
    return

  const curItem = imagesList.value[curIndex.value]

  isErrorItem.value = curItem.status === 'error'

  if (canvasRef.value && curItem.status === 'finished') {
    errorMessage.value = ''
    showImgPrompt.value = false
    canvasRef.value.style.backgroundImage = `url(${curItem.gpt_content})`
    imgPrompt.value = curItem.user_content
  }
  else if (canvasRef.value) {
    errorMessage.value = curItem.gpt_content
    canvasRef.value.style.backgroundImage = `url(${defaultData})`
  }
}

function onCanvasReSize() {
  if (!canvasRef.value)
    return

  const canvasRootView = document.getElementById('canvas-root-view')!

  const width = canvasRootView.clientWidth - 48
  const height = canvasRootView.clientHeight - 48

  const size = Math.min(width, height) - 32

  canvasSize.value = size
}

async function generateImage() {
  if (loadingImg.value === true) {
    push.warning(t('drawImg.loading_hint'))
    return
  }

  if (!prompt.value || prompt.value.length === 0) {
    push.error(t('drawImg.prompt_empty_hint'))
    return
  }

  loadingImg.value = true

  const response = await openAIServices.createImagesGenerationsRequest(prompt.value, imgStyle.value)

  if (response.code === -1 || response.data == null) {
    push.error(t('drawImg.failed'))
    updateImageMessage(response.message, prompt.value, t('drawImg.failed'), 'error')
  }
  else {
    const result = await ImageGenerationParser(response.data!)
    const img_b64 = result.b64_data
    const revised_prompt = result.revised_prompt
    updateImageMessage(img_b64, prompt.value, revised_prompt, 'finished')
  }

  loadingImg.value = false
}

async function updateImageMessage(img_b64: string, message: string, prompt: string, status: 'finished' | 'error') {
  const newMessageInfo: NewMessageInfo = {
    conversation_id: chatCompletionHandler?.getConversationInfo().id ?? -1,
    user_content: prompt,
    gpt_content: img_b64,
    create_time: Date.now(),
    token_id: uid(32),
    status,
  }

  await messageController.addNewMessageAsync(newMessageInfo)
  loadImgList()
}

function previousImg() {
  curIndex.value -= 1
}

function nextImg() {
  curIndex.value += 1
}

function uploadImg() {
  if (loadingImg.value === true) {
    push.warning(t('generate_image_ing_hint'))
    return
  }

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png'
  input.click()

  input.addEventListener('change', (event: any) => {
    const files = event.target?.files ?? []
    if (files.length === 0)
      return
    const file = files[0]
    const reader = new FileReader()
    reader.onloadend = (result) => {
      const img = (result.target?.result as string).split(',')[1]
      updateImageMessage(img, '', '', 'finished')
    }
    reader.readAsDataURL(file)
  })
}

function onDeleteConfirm() {
  openDeleteConfirmDialog.value = true
}

function onDelete() {
  const messageId = imagesList.value[curIndex.value].id
  messageController.deleteMessageByIdAsync(messageId).then(() => loadImgList())
}

function toggleOpenEditTools() {
  openEditTools.value = !openEditTools.value
}

function downloadImg() {
  if (imagesList.value.length <= 0) {
    push.error(t('no_image_to_download'))
    return
  }

  const cur_img_b64_data = `${imagesList.value[curIndex.value].gpt_content}`
  const link = document.createElement('a')
  link.href = cur_img_b64_data
  link.download = `${uid(32)}.png`
  link.click()
}
</script>

<template>
  <div class="bg-body h-full flex flex-col">
    <div id="editor-view" class="bg-base p-4 b-0 b-b-1 b-solid border-base flex flex-col gap-2">
      <input
        v-model.trim="prompt" class=" outline-none w-full color-base text-4 bg-transparent b-0 min-w-100%"
        :placeholder="t('draw_img_hint')" @keydown.enter="generateImage"
      >

      <div class="flex flex-row-reverse gap-2">
        <button
          class="outline-none b-1 b-rd border-base b-solid p-2 bg-body color-base hover-bg-base px-4"
          @click="generateImage"
        >
          <div class="flex flex-row gap-2">
            <div v-if="loadingImg" class="i-svg-spinners-270-ring h-18px w-18px" />
            <div>{{ loadingImg ? t('generate_image_ing') : t('generate_image') }}</div>
          </div>
        </button>
        <div class="flex-1" />
      </div>
    </div>

    <div class="flex-1 flex flex-row overflow-hidden bg-base relative">
      <div id="canvas-root-view" class="flex flex-col flex-1 overflow-hidden">
        <div class="b-0 b-b-1 b-solid border-base p-2 px-4 flex flex-row gap-2">
          <button
            class="bg-body hover-bg-base outline-none b-1 b-solid border-base color-base p-2 b-rd px-4"
            @click="previousImg"
          >
            {{ t('previous_img') }}
          </button>
          <button
            class="bg-body hover-bg-base outline-none b-1 b-solid border-base color-base p-2 b-rd px-4"
            @click="nextImg"
          >
            {{ t('next_img') }}
          </button>
          <div class="line-height-38px color-base">
            {{ imagesList.length >= 1 ? (curIndex + 1) : "0" }}/{{ imagesList.length }}
          </div>

          <div class="flex-1" />

          <div class="icon-button p-2 b-1 b-solid border-base b-rd hover-bg-base" @click="onDeleteConfirm">
            <div class="color-red i-carbon-trash-can text-5" />
          </div>

          <div class="b-1 b-rd border-base b-solid p-1 flex flex-row color-base text-3 cursor-pointer gap-1 select-none">
            <div
              class="b-1 b-rd border-base b-solid p-1 flex flex-row px-2"
              :class="imgStyle === 'vivid' ? 'bg-blue-5 color-white' : 'bg-body'" @click="() => imgStyle = 'vivid'"
            >
              {{ t('vivid_mode') }}
            </div>
            <div
              class="b-1 b-rd border-base b-solid p-1 flex flex-row px-2"
              :class="imgStyle === 'natural' ? 'bg-blue-5 color-white' : 'bg-body'" @click="() => imgStyle = 'natural'"
            >
              {{ t('natural_mode') }}
            </div>
          </div>

          <div>
            <button
              class="b-1 b-rd border-base b-solid h-38px line-height-38px flex flex-row py-0 px-4 bg-green hover-bg-green-5 color-white"
              @click="uploadImg"
            >
              {{ t('upload_img') }}
            </button>
          </div>
        </div>

        <div
          id="canvas" class="flex flex-col gap-2 m-auto"
          :style="{ width: `${canvasSize}px`, height: `${canvasSize}px` }"
        >
          <div v-if="isErrorItem" class="color-red">
            Error message: {{ errorMessage }}
          </div>
          <div
            ref="canvasRef"
            class="relative flex-1 bg-base b-rd shadow-xl b-1 b-solid border-base bg-no-repeat bg-cover bg-center"
          >
            <div
              v-if="!isErrorItem"
              class="b-rd-b flex flex-row absolute bottom-0 left-0 bg-#50505080 w-full backdrop-blur"
              :class="showImgPrompt ? `max-h-${canvasSize}px` : 'max-h-48px'"
            >
              <div class="color-light m-8px line-height-32px flex-1 ellipsis" :class="showImgPrompt ? '' : 'text-nowrap'">
                {{ imgPrompt }}
              </div>
              <div
                class="w-18px h-18px m-15px color-light"
                :class="showImgPrompt ? 'i-carbon-chevron-down' : 'i-carbon-chevron-up'"
                @click="() => showImgPrompt = !showImgPrompt"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!openEditTools"
        class="image-edit-tool absolute w-40px h-40px b-rd-90 b-solid border-base b-1 bg-body shadow-xl top-80px right-24px hover-bg-base transition-all"
        @click="toggleOpenEditTools"
      >
        <div class="i-carbon-edit color-base w-24px h-24px m-8px" />
      </div>

      <div
        class="image-edit-tool absolute w-40px h-40px b-rd-90 b-solid border-base b-1 bg-body shadow-xl top-140px hover-bg-base transition-all"
        :class="[
          openEditTools ? 'right-380px' : 'right-24px',
        ]" @click="downloadImg"
      >
        <div class="i-carbon-download color-base w-24px h-24px m-8px" />
      </div>
    </div>
  </div>
  <div
    id="edit-message-list"
    class="flex flex-col b-0 b-l-1 b-solid border-base bg-base max-h-100% overflow-hidden transition-all" :class="[
      openEditTools ? 'w-360px' : 'w-0px',
    ]"
  >
    <div class="p-13px pt-14px b-0 b-b-1 border-base b-solid color-base font-bold text-5 flex flex-row">
      <div class="flex-1">
        {{ t('edit_img') }}
      </div>
      <div class="h-27px w-27px icon-button i-carbon-close" @click="toggleOpenEditTools" />
    </div>

    <ul class="color-base flex-1 overflow-y-scroll edit-img-list m-0 bg-base" />

    <input
      disabled class="outline-none b-0 b-t-1 border-base b-solid bg-body p-16px color-base text-4"
      :placeholder="t('edit_img_hint')" :style="{ minWidth: 'calc(100% - 32px)' }"
    >
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
</template>

<style scoped>
#editor-view,
#edit-message-list {
  background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%204096%204096%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22x37ws8lk43i60c%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221%22%20numOctaves%3D%222.8%22%20stitchTiles%3D%22stitch%22%20%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23x37ws8lk43i60c)%22%20opacity%3D%220.1%22%20%2F%3E%3C%2Fsvg%3E');
}

.edit-img-list::-webkit-scrollbar {
  border: 0px;
  border-left: 1px solid #88888825;
  width: 4px;
}

.edit-img-list::-webkit-scrollbar-thumb {
  background-color: #50505050;
}

.image-edit-tool:hover {
  box-shadow: 1px 2px 8px #00ffb330, -1px -2px 8px #00a2ff30;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
