<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { uid } from 'uid'
import useConversationStore from '@/store/conversation-store'

const { t } = useI18n()

const { width } = useWindowSize()

function createNewMessage() {
  const converstionStore = useConversationStore()
  converstionStore.createNewConversation({
    title: t('new_conversation_title'),
    color: 'bg-gray',
    create_time: Date.now(),
    description: '',
    conversation_token: uid(32),
  })
}
</script>

<template>
  <div class="w-100% h-100% flex flex-col">
    <div class="flex-1" />
    <div class="flex flex-row">
      <div class="flex-1" />
      <div
        class="flex flex-row bg-base p-6 border-base color-base" b="1 solid rd-1" :class="[
          width >= 1200 ? 'w-500px' : width >= 800 && width < 1200 ? 'w-400px' : 'w-300px',
        ]" @click="createNewMessage"
      >
        <div class="i-carbon-add text-6" />
        <div class="flex-1 m-l-2" style="line-height: 24px;">
          {{ t('new') }}
        </div>
      </div>
      <div class="flex-1" />
    </div>
    <div class="flex-1" />
  </div>
</template>
