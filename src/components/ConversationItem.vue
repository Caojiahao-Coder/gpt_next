<script setup lang="ts">
import { ref } from 'vue'
import type { TBConverstationInfo } from '@/database/table-type'
import useConversationStore from '@/store/conversation-store'

const props = defineProps<{
  conversationInfo: TBConverstationInfo
}>()

const conversationStore = useConversationStore()

async function onRemove() {
  conversationStore.deleteConversationById(props.conversationInfo.id)
}

function onSelect(event: MouseEvent) {
  if ((event.target as HTMLHtmlElement).id === 'item-close')
    return

  conversationStore.conversationInfo = props.conversationInfo
}

const deleteConfirm = ref<boolean>(false)
</script>

<template>
  <div
    b="0 b-1 solid" class="flex flex-row gap-2 p-16px border-base cursor-pointer" :class="[
      conversationStore.conversationInfo?.conversation_token! === props.conversationInfo.conversation_token! ? 'bg-gray-2 dark:bg-dark-8' : '',
    ]" @click="onSelect"
  >
    <div class="h-16px w-16px color-fade b-rd-1 m-t-4px" :class="props.conversationInfo.color" />
    <div
      class="flex-1 h-24px w-24px overflow-hidden"
      style="line-height: 24px; text-overflow: ellipsis; white-space: nowrap;"
    >
      {{ props.conversationInfo.title }}
    </div>
    <div v-if="deleteConfirm === false" id="item-close" class="i-carbon-close h-24px w-24px" data-cursor="block" @click="onRemove" />
  </div>
</template>
