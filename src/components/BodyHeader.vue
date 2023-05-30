<script setup lang="ts">
import { useConversationStore } from '@/store/conversation'
import { useLeftSideBarStore } from '@/store/leftsidebar'

const leftSideBarStore = useLeftSideBarStore()

const conversationStore = useConversationStore()

function onOpenLeftSideBar() {
  leftSideBarStore.expand = !leftSideBarStore.expand
}
</script>

<template>
  <div class="h-79px flex flex-row text-6 color-base border-base overflow-hidden gap-2" b="0 b-1 solid" p="x-24px">
    <div v-if="leftSideBarStore.expand === false" class="flex flex-col m-r-4">
      <div class="flex-1" />
      <div class="icon-button i-carbon-menu" @click="onOpenLeftSideBar" />
      <div class="flex-1" />
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1" />
      <div>
        {{ conversationStore.conversationInfo?.name }}
        <div class="flex-1" />
      </div>
      <div
        v-if="conversationStore.conversationInfo?.description && conversationStore.conversationInfo?.description!.trim().length > 0"
        class="text-3 color-fade m-t1 overflow-hidden" style="text-overflow: ellipsis;white-space: nowrap;"
      >
        {{ conversationStore.conversationInfo?.description! }}
      </div>
      <div class="flex-1" />
    </div>
    <div class="flex flex-col">
      <div class="flex-1" />
      <div class="icon-button i-carbon-clean" />
      <div class="flex-1" />
    </div>
  </div>
</template>
