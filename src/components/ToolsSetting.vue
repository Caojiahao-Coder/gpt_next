<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import conversationController from '@/chat.completion/ConversationController'

const { t } = useI18n()

function createDrawImageModeConversation() {
  conversationController.createDrawImageConversationAsync()
}
</script>

<template>
  <div class="border-base" b="0 b-1 solid">
    <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
      {{ t('ai_tools') }}
    </div>

    <div class="flex flex-row gap-4 p-4">
      <div
        class="bg-body border-solid b-1 border-base p-2 b-rd hover-bg-base color-base transition-all"
        @click="createDrawImageModeConversation()"
      >
        <div class=" text-6 i-carbon-image" />
      </div>
    </div>
  </div>
</template>
