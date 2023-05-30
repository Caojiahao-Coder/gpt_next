<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { type Conversation, useConversationDBStore } from '@/store/dbstore'
import { useConversationStore } from '@/store/conversation'

const props = defineProps<{
  conversationInfo: Conversation
  reloadConversationList: () => void
}>()

const conversationStore = useConversationStore()

async function onRemove() {
  const conversationDB = useConversationDBStore()
  await conversationDB.db.conversations.delete(props.conversationInfo.id!)
  props.reloadConversationList()

  // 如果当前删除的消息内容属于 当前正在查看的消息内容 那么需要取消当前选中项目
  if (conversationStore.conversationInfo?.token === props.conversationInfo.token!)
    conversationStore.conversationInfo = undefined
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
    b="0 b-1 solid"
    class="flex flex-row gap-4 p-16px border-base cursor-pointer"
    :class="[
      conversationStore.conversationInfo?.token! === props.conversationInfo.token! ? 'bg-gray-2 dark:bg-dark-8' : '',
    ]" @click="onSelect"
  >
    <div class="i-carbon-notification h-24px w-24px color-fade" />
    <div class="flex-1 h-24px w-24px" style="line-height: 24px;">
      {{ props.conversationInfo.name }}
    </div>
    <div v-if="deleteConfirm === false" id="item-close" class="i-carbon-close  h-24px w-24px" @click="onRemove" />
  </div>
</template>
