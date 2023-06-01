<script setup lang="ts">
import BodyHeader from '@/components/BodyHeader.vue'
import Editor from '@/components/Editor.vue'
import LeftSideBar from '@/components/LeftSideBar.vue'
import ConversationBody from '@/components/ConversationBody.vue'
import SettingSlideBar from '@/components/SettingSlideBar.vue'
import WelcomePage from '@/components/WelcomePage.vue'
import { useConversationStore } from '@/store/conversation.js'
import ErrorDialog from '@/components/ErrorDialog.vue'
import { useErrorDialogStore } from '@/store/errorDialog'

const chatContentStore = useConversationStore()
const errorDialogStore = useErrorDialogStore()
</script>

<template>
  <main class="flex flex-row h-100vh bg-base overflow-hidden">
    <LeftSideBar />
    <div class="flex flex-col flex-1 h-100% overflow-hidden">
      <BodyHeader />
      <div class="flex-1 bg-body overflow-hidden">
        <WelcomePage v-if="!chatContentStore.conversationInfo" />
        <ConversationBody v-else />
      </div>
      <Editor v-if="!errorDialogStore.showErrorDialog" />
      <ErrorDialog />
    </div>
    <SettingSlideBar />
  </main>
</template>
