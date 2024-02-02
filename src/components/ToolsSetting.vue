<script setup lang="ts">
import { ref } from 'vue'
import { uid } from 'uid'
import { useI18n } from 'vue-i18n'
import Dialog from '@/ui/Dialog.vue'
import DataWorker from '@/components/DataWorker.vue'
import { push } from '@/main'
import useConversationStore from '@/store/conversation-store'
import useGlobalStore from '@/store/global-store'
import type { NewConverstationInfo, NewMessageInfo } from '@/database/table-type'
import useMessageStore from '@/store/message-store'
import conversationController from '@/chat.completion/ConversationController'

const { t } = useI18n()

const openDialog = ref<boolean>(false)

async function onSubmitMessage(columns: string[]) {
  openDialog.value = false

  if (columns.length === 0) {
    push.warning('Sorry you at least add one columns to table!')
    return
  }

  const conversationStore = useConversationStore()
  const messageStore = useMessageStore()
  const globalSettingStore = useGlobalStore()

  const globalSettingInfo = await globalSettingStore.getGlobalSetting()

  if (!globalSettingInfo) {
    push.error(t('message_apikey_empty'))
    return
  }

  let conversationId = -1

  conversationId = await conversationStore.createNewConversation({
    title: t('new_data_worker_title'),
    color: 'bg-blue',
    create_time: Date.now(),
    description: '',
    conversation_token: uid(32),
    type: 'dataworker',
  })

  const messageInfo: NewMessageInfo = {
    conversation_id: conversationId,
    user_content: columns.join(';'),
    gpt_content: '',
    create_time: Date.now(),
    token_id: uid(32),
    status: 'waiting',
  }
  messageStore.addNewMessage(messageInfo)
}

async function createDrawImageModeConversation() {
  const newInfo = {
    title: t('draw_img_mode'),
    color: 'bg-yellow-2',
    create_time: Date.now(),
    description: '',
    conversation_token: uid(32),
    type: 'draw_img_mode',
  } as NewConverstationInfo

  createNewConversation(newInfo)
}

function createNewConversation(newInfo: NewConverstationInfo) {
  conversationController.addConversationAsync(newInfo)
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
        @click="openDialog = true"
      >
        <div class=" text-6 i-carbon-data-volume" />
      </div>

      <div
        class="bg-body border-solid b-1 border-base p-2 b-rd hover-bg-base color-base transition-all"
        @click="createDrawImageModeConversation()"
      >
        <div class=" text-6 i-carbon-image" />
      </div>
    </div>

    <Dialog title="Mock Data" :open="openDialog" @on-close="openDialog = false">
      <div class="font-light mb-4 color-base text-4">
        {{ t('data_tools_desc') }}
      </div>

      <DataWorker @on-close="openDialog = false" @on-submit="(columns) => onSubmitMessage(columns)" />
    </Dialog>
  </div>
</template>
