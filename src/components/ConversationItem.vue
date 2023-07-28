<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TBConverstationInfo } from '@/database/table-type'
import useConversationStore from '@/store/conversation-store'
import Dialog from '@/ui/Dialog.vue'

const props = defineProps<{
  conversationInfo: TBConverstationInfo
}>()

const { t } = useI18n()

const conversationStore = useConversationStore()
const showRemoveConfirmDialog = ref<boolean>(false)

async function onRemove() {
  showRemoveConfirmDialog.value = true
}

function onSelect(event: MouseEvent) {
  if ((event.target as HTMLHtmlElement).id === 'item-close')
    return

  conversationStore.conversationInfo = props.conversationInfo
}

const deleteConfirm = ref<boolean>(false)

function onCloseDeleteConfirmDialog() {
  showRemoveConfirmDialog.value = false
}

function removeConversationItem() {
  showRemoveConfirmDialog.value = false
  conversationStore.deleteConversationById(props.conversationInfo.id)
}
</script>

<template>
  <div
    b="0 b-1 solid" class="flex flex-row gap-2 p-16px border-base cursor-pointer" :class="[
      conversationStore.conversationInfo?.conversation_token! === props.conversationInfo.conversation_token! ? 'bg-gray-2 dark:bg-dark-8 selected' : '',
    ]" @click="onSelect"
  >
    <div class="h-16px w-16px color-fade b-rd-1 m-t-4px" :class="props.conversationInfo.color" />
    <div
      class="flex-1 h-24px w-24px overflow-hidden"
      style="line-height: 24px; text-overflow: ellipsis; white-space: nowrap;"
    >
      {{ props.conversationInfo.title }}
    </div>
    <div
      v-if="deleteConfirm === false" id="item-close" class="i-carbon-close h-24px w-24px" data-cursor="block"
      @click="onRemove"
    />
  </div>

  <Dialog :open="showRemoveConfirmDialog" :title="t('delete_confirm_title')" @on-close="onCloseDeleteConfirmDialog">
    <div>
      {{ t('delete_confirm_title') }}
    </div>

    <div class="m-t-4 flex flex-row">
      <div flex-1 />
      <div class="flex flex-row gap-2 ">
        <Button
          data-cursor="block"
          class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
          @click="removeConversationItem()"
        >
          {{ t('delete') }}
        </Button>
        <Button
          data-cursor="block"
          class="bg-body color-white outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
          @click="showRemoveConfirmDialog = false"
        >
          {{ t('cancel') }}
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.selected {
  background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%204096%204096%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22x37ws8lk43i60c%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221%22%20numOctaves%3D%222.8%22%20stitchTiles%3D%22stitch%22%20%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23x37ws8lk43i60c)%22%20opacity%3D%220.1%22%20%2F%3E%3C%2Fsvg%3E');
}
</style>
