<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessageSpeechStore } from '@/store/message-speech-store'

const { t } = useI18n()

const dialogRef = ref<HTMLDivElement>()

const messageSpeechStore = useMessageSpeechStore()

onMounted(() => {
  window.addEventListener('resize', () => {
    resetDialogPosition()
  })
  resetDialogPosition()
})

function resetDialogPosition() {
  const bodyHeader = document.getElementById('body-header')
  if (!bodyHeader || !dialogRef.value)
    return
  dialogRef.value.style.marginLeft = `${bodyHeader.clientWidth / 2 - dialogRef.value.clientWidth / 2 - 24}px`
}

function onCancelSpeech() {
  messageSpeechStore.cancelSpeech()
}
</script>

<template>
  <div
    id="speech-dialog" ref="dialogRef"
    class="transition-all absolute color-white b-solid b-1 border-base p-y-2 p-x-4 text-3 b-rd-90 flex-row flex gap-2 m-t-1 backdrop-blur-6 z-100 h-18px"
    :class="[
      messageSpeechStore.show ? 'top-0' : 'top--50px',
    ]"
  >
    <div i-svg-spinners-gooey-balls-1 m-auto />
    <div>{{ t('while_talking') }}</div>
    <div i-carbon-close m-auto text-5 icon-button @click="onCancelSpeech" />
  </div>
</template>

<style scoped>
html.dark #speech-dialog {
  background: linear-gradient(24deg, #2a2dce80 0%, rgba(247, 0, 208, 0.2) 100%);
}

#speech-dialog {
  background: linear-gradient(24deg, #2a2dce 0%, rgba(247, 0, 208, 0.8) 100%);
}
</style>
