<script setup lang="ts">
import { ref } from 'vue'
import ConversationDetailItem from './ConversationDetailItem.vue'
import EditSessionSettingsDialog from './EditSessionSettingsDialog.vue'

const messageList = ref<string[]>([])
</script>

<template>
  <div class="relative h-100% records-list color-base" overflow="x-hidden y-scroll">
    <ConversationDetailItem v-for="(item, index) in messageList" :key="index" :role="index % 2 !== 0 ? 'user' : 'gpt'" />

    <EditSessionSettingsDialog v-if="messageList.length === 0" />
  </div>
</template>

<style scoped>
.records-list::-webkit-scrollbar {
  width: 4px;
  border: 0;
  border-left: 1px solid #88888825;
}

.records-list::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: #88888850;
}
</style>
