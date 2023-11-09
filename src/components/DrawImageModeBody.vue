<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { uid } from 'uid'
import { fetchGenerateImages } from '@/openai/images'
import { push } from '@/main'
import useGlobalStore from '@/store/global-store'
import type { NewMessageInfo } from '@/database/table-type'
import useMessageStore from '@/store/message-store'
import useConversationStore from '@/store/conversation-store'

const messageStore = useMessageStore()

const { t } = useI18n()

const canvasRef = ref<HTMLDivElement>()

const prompt = ref<string>()

const imgURL = ref<string>('')

const loadingImg = ref<boolean>(false)

function downloadImg() {
  if (imgURL.value && imgURL.value.length >= 1) {
    const a = document.createElement('a')
    a.href = imgURL.value
    a.download = 'image.png'
    a.click()
  }
}

onMounted(() => {
  const conversationInfo = useConversationStore().conversationInfo
  messageStore.getMessageRecordsByConversationId(conversationInfo?.id ?? -1).then((res) => {
    if (res && res.length >= 1) {
      const message = res[res.length - 1]
      prompt.value = message.user_content
      imgURL.value = message.gpt_content
      canvasRef.value!.style.backgroundImage = `url(${message.gpt_content})`
    }
  })
})

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
      size: '1024x1024',
    },
  }

  fetchGenerateImages(body).then(async (res) => {
    const result = await res.json()
    const img_url = result.data[0].url.trim()
    if (canvasRef.value)
      canvasRef.value.style.backgroundImage = `url(${img_url})`

    await updateImageMessage(img_url)
  }).finally(() => {
    loadingImg.value = false
  })
}

async function updateImageMessage(img_url: string) {
  const conversationInfo = useConversationStore().conversationInfo

  const newMessageInfo: NewMessageInfo = {
    conversation_id: conversationInfo?.id ?? -1,
    user_content: prompt.value ?? '',
    gpt_content: img_url,
    create_time: Date.now(),
    token_id: uid(32),
    status: 'finished',
  }

  messageStore.addNewMessage(newMessageInfo)
}
</script>

<template>
  <div class="color-base h-full flex flex-col">
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

    <div class="flex flex-col m-auto">
      <div
        id="canvas" ref="canvasRef"
        class="flex flex-col m-16px bg-base b-rd shadow-xl b-1 b-solid border-base w-512px h-512px m-auto bg-no-repeat bg-cover bg-center"
      />
      <button
        class="outline-none b-1 b-rd border-base b-solid p-2 bg-blue hover-bg-blue-5 color-white w-512px m-auto mt-16px"
        @click="downloadImg"
      >
        {{ t('download_image') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
#editor-view {
  background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%204096%204096%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22x37ws8lk43i60c%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221%22%20numOctaves%3D%222.8%22%20stitchTiles%3D%22stitch%22%20%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23x37ws8lk43i60c)%22%20opacity%3D%220.1%22%20%2F%3E%3C%2Fsvg%3E');
}
</style>
