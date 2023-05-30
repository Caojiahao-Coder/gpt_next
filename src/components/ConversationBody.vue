<script setup lang="ts">
import ConversationDetailItem from './ConversationDetailItem.vue'
import EditSessionSettingsDialog from './EditSessionSettingsDialog.vue'
import { useMessageStore } from '@/store/message'

const messageRecordsStore = useMessageStore()
</script>

<template>
  <div class="relative h-100% records-list color-base" overflow="x-hidden y-scroll">
    <ConversationDetailItem
      v-for="(item, index) in messageRecordsStore.messageRecords"
      :key="index"
      :message-record-id="item.id!"
    />

    <EditSessionSettingsDialog v-if="messageRecordsStore.messageRecords.length === 0" />
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
