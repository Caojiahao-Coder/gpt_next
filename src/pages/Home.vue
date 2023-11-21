<script setup lang="ts">
import { onMounted } from 'vue'
import { uid } from 'uid'
import { useI18n } from 'vue-i18n'
import BodyHeader from '@/components/BodyHeader.vue'
import Editor from '@/components/Editor.vue'
import LeftSideBar from '@/components/LeftSideBar.vue'
import ConversationBody from '@/components/ConversationBody.vue'
import SettingSlideBar from '@/components/SettingSlideBar.vue'
import WelcomePage from '@/components/WelcomePage.vue'
import ErrorDialog from '@/components/ErrorDialog.vue'
import { useErrorDialogStore } from '@/store/error-dialog'
import useConversationStore from '@/store/conversation-store'
import { gptRole } from '@/store/localstorage'
import DataWorkerBody from '@/components/DataWorkerBody.vue'
import DrawImageModeBody from '@/components/DrawImageModeBody.vue'
import TipsButton from '@/components/TipsButton.vue'

const chatContentStore = useConversationStore()
const errorDialogStore = useErrorDialogStore()

const { t } = useI18n()

onMounted(() => {
  createNewConversationHotKey()
})

/**
 * used ctrl + alt + t to create new conversation
 */
function createNewConversationHotKey() {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key === 't') {
      const converstionStore = useConversationStore()
      converstionStore.createNewConversation({
        title: t('new_conversation_title'),
        color: 'bg-gray',
        create_time: Date.now(),
        description: '',
        conversation_token: uid(32),
      })
    }
    // for mac
    else if (e.metaKey && e.ctrlKey && e.key === 't') {
      const converstionStore = useConversationStore()
      converstionStore.createNewConversation({
        title: t('new_conversation_title'),
        color: 'bg-gray',
        create_time: Date.now(),
        description: '',
        conversation_token: uid(32),
      })
    }
  })
}
</script>

<template>
  <main class="flex flex-row h-100vh bg-base overflow-hidden">
    <LeftSideBar />
    <div class="flex flex-col flex-1 h-100% overflow-hidden">
      <BodyHeader />
      <div
        v-if="gptRole === 'chinese_culture'"
        class="bg-red-2 color-red-8 p-x-4 p-y-2 border-base b-0 b-b-1 b-solid shadow flex flex-row gap-2 font-bold"
      >
        <div i-carbon-information line-height-22px h-20px w-20px m-1px />
        <div>
          使用国粹模式可能会引起不适，该模式仅供娱乐，切勿当真。
        </div>
      </div>
      <div class="flex-1 bg-body overflow-hidden">
        <WelcomePage v-if="!chatContentStore.conversationInfo" />
        <ConversationBody v-else-if="(chatContentStore.conversationInfo.type ?? 'chat') === 'chat'" />
        <DataWorkerBody v-else-if="(chatContentStore.conversationInfo.type ?? 'chat') === 'dataworker'" />
        <DrawImageModeBody v-else-if="(chatContentStore.conversationInfo.type ?? 'chat') === 'draw_img_mode'" />
      </div>
      <Editor
        v-if="(!errorDialogStore.showErrorDialog) && (chatContentStore.conversationInfo?.type ?? 'chat') === 'chat'"
      />
      <ErrorDialog />
    </div>
    <SettingSlideBar />
    <TipsButton />
  </main>
</template>
