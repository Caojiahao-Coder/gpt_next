<script setup lang="ts">
import { useConversationStore } from '@/store/conversation'

const chatStore = useConversationStore()

function createNewMessage() {
  chatStore.createConversation()
}
</script>

<template>
  <div class="w-100% h-100% flex flex-col">
    <div class="flex-1" />
    <div class="flex flex-row">
      <div class="flex-1" />
      <div class="flex flex-row bg-base p-6 border-base w-35%  color-base" b="1 solid rd-1" @click="createNewMessage">
        <div class="i-carbon-add text-6" />
        <div class="flex-1 m-l-2" style="line-height: 24px;">
          New
        </div>
      </div>
      <div class="flex-1" />
    </div>
    <div class="flex-1" />
  </div>
</template>
