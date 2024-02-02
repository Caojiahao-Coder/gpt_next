<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EditSessionSettingsDialog from './EditSessionSettingsDialog.vue'
import MessageRecordItem from './MessageRecordItem.vue'
import useConversationStore from '@/store/conversation-store'
import conversationController from '@/chat.completion/ConversationController'
import type { TBConverstationInfo, TBMessageInfo } from '@/database/table-type'
import useChatCompletionStore from '@/store/chat-completion-store'

const { t } = useI18n()

const bodyRef = ref<HTMLDivElement>()

const myMessageList = ref<TBMessageInfo[]>([])

const chatCompletionStore = useChatCompletionStore()

defineExpose({
  loadMessageList,
})

onMounted(() => {
  loadMessageList()
})

async function loadMessageList() {
  const messageList = await chatCompletionStore.chatCompletionHandler?.getMessageList()
  myMessageList.value = messageList ?? []
  updateScroll()
}

function updateScroll() {
  if (bodyRef.value)
    bodyRef.value.scrollTop = bodyRef.value?.scrollHeight
}

function onCreateDrawImageConversation() {
  const conversationStore = useConversationStore()
  const info = conversationStore.conversationInfo!

  const newInfo = {
    id: info.id,
    title: t('draw_img_mode'),
    create_time: info.create_time,
    description: info.description,
    conversation_token: info.conversation_token,
    color: 'bg-yellow-2',
    fixed_top: info.fixed_top ?? false,
    type: 'draw_img_mode',
  }

  updateConversationInfo(newInfo as TBConverstationInfo)
}

function onCreateMockDataConversation() {
  const conversationStore = useConversationStore()
  const info = conversationStore.conversationInfo!

  const newInfo = {
    id: info.id,
    title: t('new_data_worker_title'),
    create_time: info.create_time,
    description: info.description,
    conversation_token: info.conversation_token,
    color: 'bg-blue',
    fixed_top: info.fixed_top ?? false,
    type: 'dataworker',
  }

  updateConversationInfo(newInfo as TBConverstationInfo)
}

function updateConversationInfo(newInfo: TBConverstationInfo) {
  conversationController.updateConversationInfoAsync(newInfo)
}
</script>

<template>
  <div ref="bodyRef" class="relative h-100% records-list color-base bg-body" overflow="x-hidden y-scroll">
    <div id="conversation-body">
      <MessageRecordItem
        v-for="(item, index) in myMessageList" :key="index" :message-info="item"
        :scroll-body="updateScroll" @on-reload-message-list="() => loadMessageList()"
      />
    </div>

    <div
      v-if="myMessageList.length <= 0"
      class="flex flex-row gap-4 flex-wrap justify-center py-4"
    >
      <EditSessionSettingsDialog>
        <div class="flex flex-row">
          <div class="flex-1" />
          <div
            data-cursor="block"
            class="border shadow-2xl bg-base  h-48px flex flex-row color-base gap-2 cursor-pointer hover-bg-body"
            b="1 solid rd-1" p="x-4"
          >
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

      <div
        data-cursor="block"
        class="border shadow-2xl bg-base h-48px flex flex-row color-base gap-2 cursor-pointer p-x-4 flex flex-col hover-bg-body"
        @click="onCreateDrawImageConversation"
      >
        <div class="flex-1" />
        <div class="flex flex-row gap-2">
          <div class="w-22px h-22px i-carbon-image" />
          <div>
            {{ t('draw_img_mode') }}
          </div>
        </div>
        <div class="flex-1" />
      </div>

      <div
        data-cursor="block"
        class="border shadow-2xl bg-base  h-48px flex flex-row color-base gap-2 cursor-pointer p-x-4 flex flex-col hover-bg-body"
        @click="onCreateMockDataConversation"
      >
        <div class="flex-1" />
        <div class="flex flex-row gap-2">
          <div class="w-22px h-22px i-carbon-data-volume" />
          <div>
            {{ t('mock_data_mode') }}
          </div>
        </div>
        <div class="flex-1" />
      </div>
    </div>
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
