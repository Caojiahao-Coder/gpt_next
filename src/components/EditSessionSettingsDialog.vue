<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '@/ui/Dialog.vue'
import { useConversationStore } from '@/store/conversation'
import { type Conversation } from '@/store/dbstore'
import SelectColorDialog from '@/ui/SelectColorDialog.vue'

const openDialog = ref<boolean>(false)

const conversationStore = useConversationStore()

const title = ref<string>(conversationStore.conversationInfo!.name!)
const description = ref<string>('')

const color = ref<string>('bg-gray-5')

function onCloseDialog() {
  openDialog.value = false
}

async function onSaveSessionSettings() {
  if (title.value.trim().length === 0) {
    window.alert('Sorry session can\'t be empty.')
    return
  }

  const info = conversationStore.conversationInfo!

  conversationStore.updateConversationInfo(info.id!, {
    id: info.id,
    name: title.value,
    token: info.token,
    model: info.model,
    createTime: info.createTime,
    color: color.value,
  } as Conversation)

  openDialog.value = false
}
</script>

<template>
  <div
    class="absolute top-24px border shadow-2xl bg-base w-180px h-48px flex flex-row color-base gap-2 cursor-pointer"
    b="1 solid rd-1" p="x-4" style="left:calc(50% - 107px);" @click="() => openDialog = true"
  >
    <div class="flex flex-col">
      <div class="flex-1" />
      <div class="i-carbon-audio-console" />
      <div class="flex-1" />
    </div>
    <div class="flex-1 flex flex-col">
      <div class="flex-1" />
      <div>
        Edit session settings.
      </div>
      <div class="flex-1" />
    </div>
  </div>
  <Dialog title="Edit session settings" :open="openDialog" @on-close="onCloseDialog">
    <div>
      <div>
        Session theme color:
      </div>
      <div class="m-t-2">
        <SelectColorDialog :color="color" large @on-selected-color="(colorValue:string) => color = colorValue" />
      </div>
      <div class="m-t-4">
        Session title:
      </div>
      <div class="m-t-2 flex flex-row">
        <input v-model="title" class="flex-1 border-base outline-none bg-body color-base" b="1 solid rd-1" p="x-4 y-2">
      </div>
      <div class="m-t-4">
        Session description:
      </div>
      <div class="m-t-2 flex flex-row">
        <textarea
          v-model="description" class="flex-1 border-base outline-none bg-body color-base min-h-240px"
          b="1 solid rd-1" p="x-4 y-2"
        />
      </div>

      <div class="m-t-4 flex flex-row">
        <div class="flex-1" />
        <div class="flex flex-row gap-2">
          <button
            class="bg-body color-base outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
            @click="onSaveSessionSettings"
          >
            Save
          </button>
          <button
            class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
            @click="onCloseDialog"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
