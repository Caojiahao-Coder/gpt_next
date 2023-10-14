<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from '@/ui/Dialog.vue'
import useConversationStore from '@/store/conversation-store'
import SelectColorDialog from '@/ui/SelectColorDialog.vue'
import { push } from '@/main'

const { t } = useI18n()

const openDialog = ref<boolean>(false)

const conversationStore = useConversationStore()

const title = ref<string>('')
const description = ref<string>('')
const color = ref<string>('')

async function onSaveSessionSettings() {
  if (title.value.trim().length === 0) {
    push.error(t('message_session_title_empty'))
    return
  }

  const info = conversationStore.conversationInfo!

  conversationStore.updateConversationInfoById({
    id: info.id,
    title: title.value,
    create_time: info.create_time,
    description: description.value,
    conversation_token: info.conversation_token,
    color: color.value,
    fixed_top: info.fixed_top ?? false,
    type: info.type,
  })

  openDialog.value = false
}

function onOpenEditDialog() {
  title.value = conversationStore.conversationInfo!.title
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
        <input
          v-model="title" data-cursor="text" class="flex-1 border-base outline-none bg-body color-base"
          b="1 solid rd-1" p="x-4 y-2"
        >
      </div>
      <div class="m-t-4">
        {{ t('session_desc') }}
      </div>
      <div class="m-t-2 flex flex-row">
        <textarea
          v-model="description" data-cursor="text"
          class="flex-1 border-base outline-none bg-body color-base min-h-240px" b="1 solid rd-1" p="x-4 y-2"
        />
      </div>

      <div class="m-t-4 flex flex-row">
        <div class="flex-1" />
        <div class="flex flex-row gap-2">
          <button
            data-cursor="block" class="bg-body color-base outline-none border-base hover-bg-base" b="1px solid rd-1"
            p="x-4 y-2" @click="onSaveSessionSettings"
          >
            {{ t('save') }}
          </button>
          <button
            data-cursor="block" class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1"
            p="x-4 y-2" @click="onCloseDialog"
          >
            {{ t('cancel') }}
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
