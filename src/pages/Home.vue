<script setup lang="ts">
import BodyHeader from '@/components/BodyHeader.vue'
import Editor from '@/components/Editor.vue'
import LeftSideBar from '@/components/LeftSideBar.vue'
import SettingSlideBar from '@/components/SettingSlideBar.vue'
import WelcomePage from '@/components/WelcomePage.vue'
import { useConversationStore } from '@/store/conversation.js'

const chatContentStore = useConversationStore()
</script>

<template>
  <main class="flex flex-row h-100vh bg-base overflow-hidden">
    <LeftSideBar />
    <div class="flex flex-col flex-1 h-100% overflow-hidden">
      <BodyHeader />
      <div class="flex-1 bg-body">
        <WelcomePage v-if="!chatContentStore.conversationToken" />
      </div>
      <Editor />
    </div>
    <SettingSlideBar />
  </main>
</template>
