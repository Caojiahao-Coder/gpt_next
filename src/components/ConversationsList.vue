<script setup lang="ts">
import { onMounted } from 'vue'
import ConversationItem from '@/components/ConversationItem.vue'
import { useConversationStore } from '@/store/conversation'

const conversationStore = useConversationStore()

onMounted(() => {
  conversationStore.getConversationList()
})
</script>

<template>
  <div class="w-320px flex-1 conversations-list overflow-x-hidden overflow-y-scroll color-base">
    <ConversationItem
      v-for="(item, index) in conversationStore.conversationList"
      :key="index"
      :conversation-info="item"
    />
  </div>
</template>

<style scoped>
.conversations-list::-webkit-scrollbar {
  display: none;
  border: 0px;
  border-left: 1px solid #88888825 ;
  width: 4px;
}

.conversations-list::-webkit-scrollbar-thumb{
  border-radius: 6px;
  background: #88888850;
}
</style>
