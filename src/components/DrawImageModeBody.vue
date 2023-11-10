<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref, watch } from 'vue'
import { uid } from 'uid'
import { fetchGenerateImages } from '@/openai/images'
import { push } from '@/main'
import useGlobalStore from '@/store/global-store'
import type { NewMessageInfo, TBMessageInfo } from '@/database/table-type'
import Dialog from '@/ui/Dialog.vue'
import useMessageStore from '@/store/message-store'
import useConversationStore from '@/store/conversation-store'

const messageStore = useMessageStore()

const { t } = useI18n()

const canvasRef = ref<HTMLDivElement>()

const prompt = ref<string>()

const loadingImg = ref<boolean>(false)

const canvasSize = ref<number>(0)

const imagesList = ref<TBMessageInfo[]>([])

const curIndex = ref<number>(0)

const imgStyle = ref<'vivid' | 'natural'>('natural')

const openDeleteConfirmDialog = ref<boolean>(false)

onMounted(() => {
  loadImgList()
  window.onresize = onCanvasReSize
  onCanvasReSize()
})

function loadImgList() {
  const conversationInfo = useConversationStore().conversationInfo
  messageStore.getMessageRecordsByConversationId(conversationInfo?.id ?? -1).then((res) => {
    imagesList.value = res
    curIndex.value = res.length - 1
    bindNewImg()

    if (res.length === 0)
      canvasRef.value!.style.backgroundImage = 'url("")'
  })
}

watch(curIndex, () => {
  curIndex.value = Math.max(curIndex.value, 0)
  curIndex.value = Math.min(imagesList.value.length - 1, curIndex.value)
  bindNewImg()
})

function bindNewImg() {
  if (canvasRef.value)
    canvasRef.value.style.backgroundImage = `url(data:image/png;base64,${imagesList.value[curIndex.value]?.gpt_content})`
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
  if (!prompt.value || prompt.value.length === 0) {
    push.error(t('image_requirement_cannot_empty'))
    return
  }

  loadingImg.value = true

  const globalSettingInfo = await useGlobalStore().getGlobalSetting()
  const body = {
    apikey: globalSettingInfo.api_key,
    body: {
      model: 'dall-e-3',
      prompt: prompt.value,
      n: 1,
      quality: 'hd',
      style: imgStyle.value,
      size: '1024x1024',
      response_format: 'b64_json',
    },
  }

  fetchGenerateImages(body).then(async (res) => {
    const result = await res.json()
    const img_b64 = result.data[0].b64_json
    if (canvasRef.value)
      canvasRef.value.style.backgroundImage = `url(data:image/png;base64,${img_b64})`

    await updateImageMessage(img_b64, prompt.value ?? '')
  }).catch(() => {
    push.error(t('generate_image_error'))
  }).finally(() => {
    loadingImg.value = false
  })
}

async function updateImageMessage(img_b64: string, message: string) {
  const conversationInfo = useConversationStore().conversationInfo

  const newMessageInfo: NewMessageInfo = {
    conversation_id: conversationInfo?.id ?? -1,
    user_content: message,
    gpt_content: img_b64,
    create_time: Date.now(),
    token_id: uid(32),
    status: 'finished',
  }

  messageStore.addNewMessage(newMessageInfo)

  loadImgList()
}

function previousImg() {
  curIndex.value -= 1
}

function nextImg() {
  curIndex.value += 1
}

function uploadImg() {
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
      updateImageMessage(img, '')
    }
    reader.readAsDataURL(file)
  })
}

function onDeleteConfirm() {
  openDeleteConfirmDialog.value = true
}

async function onDelete() {
  const messageStore = useMessageStore()
  openDeleteConfirmDialog.value = false
  await messageStore.deleteMessageItem(imagesList.value[curIndex.value].id)
  loadImgList()
}
</script>

<template>
  <div class="bg-body h-full flex flex-col">
    <div id="editor-view" class="bg-body p-4 b-0 b-b-1 b-solid border-base flex flex-col gap-2">
      <textarea
        v-model.trim="prompt" class=" outline-none w-full color-base text-4 bg-transparent b-0 min-w-100%"
        autofocus :placeholder="t('draw_img_hint')"
      />

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

    <div class="flex-1 flex flex-row overflow-hidden">
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
          id="canvas" ref="canvasRef"
          class="flex flex-col bg-base b-rd shadow-xl b-1 b-solid border-base m-auto bg-no-repeat bg-cover bg-center"
          :style="{ width: `${canvasSize}px`, height: `${canvasSize}px` }"
        />
      </div>
      <div id="edit-message-list" class="flex flex-col w-360px b-0 b-l-1 b-solid border-base bg-body max-h-100%">
        <div class="p-13px pt-14px b-0 b-b-1 border-base b-solid color-base font-bold text-5">
          {{ t('edit_img') }}
        </div>

        <ul class="color-base flex-1 overflow-y-scroll edit-img-list m-0">
          <li class="py-2">
            去掉人物的眉毛
          </li>
        </ul>

        <input
          class="outline-none b-0 b-b-1 b-t-1 border-base b-solid bg-body p-16px color-base text-4"
          :placeholder="t('edit_img_hint')" :style="{ minWidth: 'calc(100% - 32px)' }"
        >
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
  </div>
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
</style>
