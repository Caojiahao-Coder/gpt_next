<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TBConverstationInfo } from '@/database/table-type'
import useConversationStore from '@/store/conversation-store'
import Dialog from '@/ui/Dialog.vue'
import conversationController from '@/chat.completion/ConversationController'
import { push } from '@/main'

const props = defineProps<{
  conversationInfo: TBConverstationInfo
}>()

const { t } = useI18n()

const enterContainer = ref<boolean>(false)

const conversationStore = useConversationStore()

const showRemoveConfirmDialog = ref<boolean>(false)

async function onRemove() {
  showRemoveConfirmDialog.value = true
}

function onSelect(event: MouseEvent) {
  if ((event.target as HTMLHtmlElement).id === 'item-close')
    return
  conversationStore.setConversationInfo(props.conversationInfo)
}

const deleteConfirm = ref<boolean>(false)

function onCloseDeleteConfirmDialog() {
  showRemoveConfirmDialog.value = false
}

async function removeConversationItem() {
  const result = await conversationController.removeConversationByIdAsync(props.conversationInfo.id)
  if (result)
    conversationStore.updateConversationList()
  showRemoveConfirmDialog.value = false
}

/**
 * set conversation fixed top
 */
function fixedTop() {
  const info = props.conversationInfo

  const newConversationInfo = {
    id: info.id,
    title: info.title,
    create_time: info.create_time,
    description: info.description,
    conversation_token: info.conversation_token,
    color: info.color,
    fixed_top: !(info.fixed_top ?? false),
    type: info.type,
  }

  conversationController.updateConversationInfoAsync(newConversationInfo).then((res) => {
    if (res)
      conversationStore.updateConversationList()
    else
      push.error(t('update_conversation_failed'))
  })
}
</script>

<template>
  <div
    class="b-1 border-base b-solid flex flex-row gap-2 p-3 cursor-pointer m-1 b-rd " :class="[
      conversationStore.conversationInfo?.conversation_token! === props.conversationInfo.conversation_token! ? 'bg-gray-2 dark:bg-dark-8 selected' : '',
    ]" @click="onSelect" @mouseenter="enterContainer = true" @mouseleave="enterContainer = false"
  >
    <div
      v-if="enterContainer || (props.conversationInfo.fixed_top ?? false)"
      class="h-16px w-16px color-fade b-rd-1 m-t-4px icon-button" :class="[
        props.conversationInfo.fixed_top ?? false ? 'i-carbon-pin-filled' : 'i-carbon-pin',
        props.conversationInfo.color,
      ]" data-cursor="block" @click="fixedTop"
    />
    <div v-else class="h-16px w-16px color-fade b-rd-1 m-t-4px" :class="props.conversationInfo.color" />

    <div class="flex-1 h-24px w-24px overflow-hidden line-height-24px truncate">
      {{ props.conversationInfo.title }}
    </div>
    <div
      v-if="deleteConfirm === false" id="item-close" class="i-carbon-close h-24px w-24px icon-button"
      data-cursor="block" @click="onRemove"
    />
  </div>

  <Dialog :open="showRemoveConfirmDialog" :title="t('delete_confirm_title')" @on-close="onCloseDeleteConfirmDialog">
    <div>
      {{ t('delete_confirm_title') }}
    </div>

    <div class="m-t-4 text-right">
      <button
        data-cursor="block" class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1"
        p="x-4 y-2" @click="removeConversationItem()"
      >
        {{ t('delete') }}
      </button>
      <button
        data-cursor="block" class="bg-body m-l-2 color-base outline-none border-base hover-bg-base"
        b="1px solid rd-1" p="x-4 y-2" @click="showRemoveConfirmDialog = false"
      >
        {{ t('cancel') }}
      </button>
    </div>
  </Dialog>
</template>

<style scoped>
.selected {
  background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%204096%204096%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22x37ws8lk43i60c%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221%22%20numOctaves%3D%222.8%22%20stitchTiles%3D%22stitch%22%20%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23x37ws8lk43i60c)%22%20opacity%3D%220.1%22%20%2F%3E%3C%2Fsvg%3E');
}
</style>
