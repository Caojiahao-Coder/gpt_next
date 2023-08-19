<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EditSessionSettingsDialog from './EditSessionSettingsDialog.vue'
import MessageRecordItem from './MessageRecordItem.vue'
import useMessageStore from '@/store/message-store'

const { t } = useI18n()

const messageRecordsStore = useMessageStore()

const bodyRef = ref<HTMLDivElement>()

function updateScroll() {
  if (bodyRef.value)
    bodyRef.value.scrollTop = bodyRef.value?.scrollHeight
}
</script>

<template>
  <div ref="bodyRef" class="relative h-100% records-list color-base bg-body" overflow="x-hidden y-scroll">
    <div id="conversation-body">
      <MessageRecordItem v-for="(item, index) in messageRecordsStore.messageList" :key="index" :message-info="item"
        :scroll-body="updateScroll" />
    </div>

    <EditSessionSettingsDialog v-if="!messageRecordsStore.messageList || messageRecordsStore.messageList.length === 0">
      <div class="flex flex-row m-t-24px">
        <div class="flex-1" />
        <div data-cursor="block" class="border shadow-2xl bg-base  h-48px flex flex-row color-base gap-2 cursor-pointer"
          b="1 solid rd-1" p="x-4">
          <div class="flex flex-col">
            <div class="flex-1" />
            <div class="i-carbon-audio-console" />
            <div class="flex-1" />
          </div>
          <div class="flex-1 flex flex-col">
            <div class="flex-1" />
            <div>
              {{ t('edit_session_title') }}
            </div>
            <div class="flex-1" />
          </div>
        </div>
        <div class="flex-1" />
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
