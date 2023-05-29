<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { watch } from 'vue'
import ConversationsList from './ConversationsList.vue'
import { useLeftSideBarStore } from '@/store/leftsidebar'
import { useConversationStore } from '@/store/conversation'

const { width } = useWindowSize()

const expandStore = useLeftSideBarStore()

watch(width, (newValue) => {
  expandStore.expand = (newValue >= 800)
})

function openGithub() {
  window.location.href = 'https://github.com/Caojiahao-Coder/gpt_next'
}

function onCloseLeftSideBar() {
  expandStore.expand = false
}

function onCreateNewConversation() {
  const conversationStore = useConversationStore()
  conversationStore.createConversation()
}
</script>

<template>
  <div
    :class="expandStore.expand === true ? 'w-320px' : 'w-0px'"
    class="transition-all h-100vh bg-base flex-shrink-0 flex flex-col color-base overflow-hidden border-base"
    b="0 r-1 solid"
  >
    <div class="h-47px p-16px border-base" b="0 b-1 solid">
      <div class="flex flex-rows" style="line-height: 47px;">
        <div class="flex-1 text-6 font-bold">
          CONVERSATIONS
        </div>
        <div i-carbon-add-comment class="text-6 icon-button" m="y-12px" @click="onCreateNewConversation" />
        <div v-if="width <= 800" i-carbon-close class="text-6 icon-button m-l-2" m="y-12px " @click="onCloseLeftSideBar" />
      </div>
    </div>

    <ConversationsList />

    <div class="grid grid-cols-3 gap-6 h-47px border-base" p="16px" b="0 t-1 solid">
      <div icon-button w-24px h-24px m-auto i-carbon-logo-github @click="openGithub" />
      <div icon-button w-24px h-24px m-auto i-carbon-logo-vue />
      <div icon-button w-24px h-24px m-auto i-devicon-plain-docker />
    </div>
  </div>
</template>
