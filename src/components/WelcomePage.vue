<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { uid } from 'uid'
import conversationController from '@/chat.completion/ConversationController'
import { alwaysUseGroq } from '@/store/localstorage'

const { t } = useI18n()

const { width } = useWindowSize()

function createNewMessage() {
  const newInfo = {
    title: t('new_conversation_title'),
    color: 'bg-gray',
    create_time: Date.now(),
    description: '',
    conversation_token: uid(32),
    use_groq: alwaysUseGroq.value,
  }
  conversationController.addConversationAsync(newInfo)
}
</script>

<template>
  <div class="w-100% h-100% flex flex-col">
    <div class="flex-1" />
    <div class="flex flex-row">
      <div class="flex-1" />
      <div
        data-cursor="block" class="flex flex-row bg-base p-4 border-base color-base shadow-xl hover-bg-body transition-all" b="1 solid rd-1" :class="[
          width >= 1200 ? 'w-600px' : width >= 800 && width < 1200 ? 'w-500px' : 'w-400px',
        ]" @click="createNewMessage"
      >
        <div class="flex-1" />
        <div class="text-6 line-height-42px h-42px i-carbon-add" />
        <div class="m-l-2 line-height-42px h-42px">
          {{ t('new') }}
        </div>
        <div class="create-hot-key flex flex-row b-rd b-1 border-base b-solid p-x-4 py-2 ml-24px bg-base">
          <div class="line-height-24px">
            Ctrl
          </div>
          <div class="i-carbon-add text-6 line-height-24px" />
          <div class="line-height-24px">
            Alt
          </div>
          <div class="i-carbon-add text-6 line-height-24px" />
          <div class="line-height-24px">
            T
          </div>
        </div>

        <div class="create-hot-key flex flex-row b-rd b-1 border-base b-solid p-x-4 py-2 ml-24px bg-base">
          <div class="line-height-24px h-24px i-carbon-mac-command" />
          <div class="i-carbon-add h-24px" />
          <div class="line-height-24px h-24px i-carbon-mac-option" />
          <div class="i-carbon-add text-6 line-height-24px" />
          <div class="line-height-24px">
            T
          </div>
        </div>
        <div class="flex-1" />
      </div>
      <div class="flex-1" />
    </div>
    <div class="flex-1" />
  </div>
</template>

<style scoped>
html.dark .create-hot-key {
  background: linear-gradient(251deg, rgba(174, 26, 26, 0.20) 0%, rgba(62, 8, 67, 0.11) 49.52%, rgba(27, 2, 35, 0.20) 100%), rgba(17, 17, 17, 0.90);
}

.create-hot-key {
  background: linear-gradient(112deg, rgba(155, 216, 228, 0.20) 33.17%, rgba(213, 179, 133, 0.20) 100%), linear-gradient(257deg, rgba(49, 89, 81, 0.20) 16.24%, rgba(181, 88, 70, 0.20) 73.46%), rgba(255, 255, 255, 0.90);
}
</style>
