<script setup lang="ts">
import { ref } from 'vue'
import EditSessionSettingsDialog from './EditSessionSettingsDialog.vue'
import { useConversationStore } from '@/store/conversation'
import { useLeftSideBarStore } from '@/store/leftsidebar'
import { useMessageStore } from '@/store/message'
import Dialog from '@/ui/Dialog.vue'

const leftSideBarStore = useLeftSideBarStore()

const conversationStore = useConversationStore()

const openConfirmDialog = ref<boolean>(false)

const messageStore = useMessageStore()

function onOpenLeftSideBar() {
  leftSideBarStore.expand = !leftSideBarStore.expand
}

function openDialog() {
  openConfirmDialog.value = true
}

function closeDialog() {
  openConfirmDialog.value = false
}

function clearMessageRecords() {
  messageStore.clearMessageRecords(conversationStore.conversationInfo!.id!)
  openConfirmDialog.value = false
}
</script>

<template>
  <div class="h-79px flex flex-row text-6 color-base border-base overflow-hidden gap-2" b="0 b-1 solid" p="x-24px">
    <div v-if="leftSideBarStore.expand === false" class="flex flex-col m-r-4">
      <div class="flex-1" />
      <div class="icon-button i-carbon-menu" @click="onOpenLeftSideBar" />
      <div class="flex-1" />
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1" />
      <div>
        {{ conversationStore.conversationInfo?.name }}
        <div class="flex-1" />
      </div>
      <div
        v-if="conversationStore.conversationInfo?.description && conversationStore.conversationInfo?.description!.trim().length > 0"
        class="text-3 color-fade m-t1 overflow-hidden" style="text-overflow: ellipsis;white-space: nowrap;"
      >
        {{ conversationStore.conversationInfo?.description! }}
      </div>
      <div class="flex-1" />
    </div>
    <div class="flex flex-col">
      <div class="flex-1" />
      <div class="flex flex-row gap-2">
        <EditSessionSettingsDialog v-if="conversationStore.conversationInfo">
          <div class="icon-button i-carbon-audio-console" />
        </EditSessionSettingsDialog>
        <div v-if="conversationStore.conversationInfo" class="icon-button i-carbon-clean" @click="openDialog" />
      </div>
      <div class="flex-1" />
    </div>
  </div>

  <Dialog :open="openConfirmDialog" title="Are you sure clear the message records?" @on-close="closeDialog">
    <div style="line-height: 32px;">
      Are you sure you want to delete the chat from this conversation?
      <br>
      <span class="color-red">(Operation cannot be restored)</span>
    </div>
    <div class="flex flex-1 m-t-2">
      <div class="flex-1" />
      <button class="outline-none border-base bg-red color-white" b="1 solid rd-1" p="x-4 y-2" @click="clearMessageRecords">
        Clear
      </button>

      <button class="outline-none border-base bg-gray color-white m-l-2" b="1 solid rd-1" p="x-4 y-2" @click="closeDialog">
        Cancel
      </button>
    </div>
  </Dialog>
</template>
