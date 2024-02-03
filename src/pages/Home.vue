<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { uid } from 'uid'
import { useI18n } from 'vue-i18n'
import BodyHeader from '@/components/BodyHeader.vue'
import Editor from '@/components/Editor.vue'
import LeftSideBar from '@/components/LeftSideBar.vue'
import ConversationBody from '@/components/ConversationBody.vue'
import SettingSlideBar from '@/components/SettingSlideBar.vue'
import WelcomePage from '@/components/WelcomePage.vue'
import useConversationStore from '@/store/conversation-store'
import DataWorkerBody from '@/components/DataWorkerBody.vue'
import DrawImageModeBody from '@/components/DrawImageModeBody.vue'
import conversationController from '@/chat.completion/ConversationController'

const conversationStore = useConversationStore()

const { t } = useI18n()

const bodyRef = ref<any>(null)

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

  conversationController.addConversationAsync(newInfo)
}

function onUpdateMessageList() {
  bodyRef.value?.loadMessageList()
}
</script>

<template>
  <main class="flex flex-row h-100vh bg-base overflow-hidden">
    <LeftSideBar />
    <div class="flex flex-col flex-1 h-100% overflow-hidden">
      <BodyHeader @on-update-message-list="onUpdateMessageList()" />
      <div class="flex-1 bg-body overflow-hidden">
        <WelcomePage v-if="!conversationStore.conversationInfo" />
        <ConversationBody v-else-if="(conversationStore.conversationInfo.type ?? 'chat') === 'chat'" ref="bodyRef" />
        <DataWorkerBody v-else-if="(conversationStore.conversationInfo.type ?? 'chat') === 'dataworker'" ref="bodyRef" />
        <DrawImageModeBody
          v-else-if="(conversationStore.conversationInfo.type ?? 'chat') === 'draw_img_mode'"
          ref="bodyRef"
        />
      </div>
      <Editor v-if="(conversationStore.conversationInfo?.type ?? 'chat') === 'chat'" @on-sended="onUpdateMessageList" />
    </div>
    <SettingSlideBar />
  </main>
</template>
