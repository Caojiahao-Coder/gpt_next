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
import DataWorkerBody from '@/components/DataWorkerBody.vue'
import DrawImageModeBody from '@/components/DrawImageModeBody.vue'
import conversationController from '@/chat.completion/ConversationController'

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
    if ((e.ctrlKey && e.altKey && e.key === 't') || (e.metaKey && e.ctrlKey && e.key === 't'))
      createNewConversation()
  })
}

function createNewConversation() {
  const newInfo = {
    title: t('new_conversation_title'),
    color: 'bg-gray',
    create_time: Date.now(),
    description: '',
    conversation_token: uid(32),
  }

  conversationController.addConversationAsync(newInfo).then((res) => {
    if (res.result) {
      chatContentStore.updateConversationList()
      setTimeout(() => chatContentStore.updateConversationInfoById(res.id), 20)
    }
  })
}
</script>

<template>
  <main class="flex flex-row h-100vh bg-base overflow-hidden">
    <LeftSideBar />
    <div class="flex flex-col flex-1 h-100% overflow-hidden">
      <BodyHeader />
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
  </main>
</template>
