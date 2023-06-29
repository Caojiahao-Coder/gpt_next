<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from '@/ui/Dialog.vue'
import { useConversationStore } from '@/store/conversation'
import { type Conversation } from '@/store/dbstore'
import SelectColorDialog from '@/ui/SelectColorDialog.vue'

const { t } = useI18n()

const openDialog = ref<boolean>(false)

const conversationStore = useConversationStore()

const title = ref<string>('')
const description = ref<string>('')
const color = ref<string>('')

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
    description: description.value.trim().length === 0 ? undefined : description.value.trim(),
  } as Conversation)

  openDialog.value = false
}

function onOpenEditDialog() {
  title.value = conversationStore.conversationInfo!.name
  description.value = conversationStore.conversationInfo!.description ?? ''
  color.value = conversationStore.conversationInfo!.color

  openDialog.value = true
}

function onCloseDialog() {
  openDialog.value = false
}
</script>

<template>
  <div @click="onOpenEditDialog">
    <slot />
  </div>
  <Dialog :title="t('edit_session_title')" :open="openDialog" @on-close="onCloseDialog">
    <div>
      <div>
        {{ t('session_theme_color') }}
      </div>
      <div class="m-t-2">
        <SelectColorDialog :color="color" large @on-selected-color="(colorValue: string) => color = colorValue" />
      </div>
      <div class="m-t-4">
        {{ t('session_title') }}
      </div>
      <div class="m-t-2 flex flex-row">
        <input v-model="title" class="flex-1 border-base outline-none bg-body color-base" b="1 solid rd-1" p="x-4 y-2">
      </div>
      <div class="m-t-4">
        {{ t('session_desc') }}
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
            {{ t('save') }}
          </button>
          <button
            class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
            @click="onCloseDialog"
          >
            {{ t('cancel') }}
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
