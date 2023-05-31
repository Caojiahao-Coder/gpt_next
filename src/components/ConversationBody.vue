<script setup lang="ts">
import { ref } from 'vue'
import ConversationDetailItem from './ConversationDetailItem.vue'
import EditSessionSettingsDialog from './EditSessionSettingsDialog.vue'
import { useMessageStore } from '@/store/message'

const messageRecordsStore = useMessageStore()

const bodyRef = ref<HTMLDivElement>()

function updateScroll() {
  if (bodyRef.value)
    bodyRef.value.scrollTop = bodyRef.value?.scrollHeight
}
</script>

<template>
  <div ref="bodyRef" class="relative h-100% records-list color-base" overflow="x-hidden y-scroll">
    <ConversationDetailItem
      v-for="(item, index) in messageRecordsStore.messageRecords"
      :key="index"
      :message-record-id="item.id!"
      :scroll-body="updateScroll"
    />

    <EditSessionSettingsDialog v-if="messageRecordsStore.messageRecords.length === 0">
      <div
        class="absolute top-24px border shadow-2xl bg-base w-180px h-48px flex flex-row color-base gap-2 cursor-pointer"
        b="1 solid rd-1" p="x-4" style="left:calc(50% - 107px);"
      >
        <div class="flex flex-col">
          <div class="flex-1" />
          <div class="i-carbon-audio-console" />
          <div class="flex-1" />
        </div>
        <div class="flex-1 flex flex-col">
          <div class="flex-1" />
          <div>
            Edit session settings.
          </div>
          <div class="flex-1" />
        </div>
      </div>
    </EditSessionSettingsDialog>
  </div>
</template>

<style scoped>
.records-list::-webkit-scrollbar {
  display: none;
}

.records-list::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: #88888850;
}
</style>
