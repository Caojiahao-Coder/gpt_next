<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ConversationItem from '@/components/ConversationItem.vue'
import type { Conversation } from '@/store/dbstore'
import { useConversationDBStore } from '@/store/dbstore'
import { useConversationStore } from '@/store/conversation'

const dbStore = useConversationDBStore()

const conversationStore = useConversationStore()

const conversationList = ref<Conversation[]>()

function getConversationsList() {
  dbStore.db.conversations.toArray().then((res) => {
    conversationList.value = res.reverse()
  })
}

watch(conversationStore, () => {
  getConversationsList()
})

onMounted(() => {
  getConversationsList()
})
</script>

<template>
  <div class="w-320px flex-1 conversations-list overflow-x-hidden overflow-y-scroll color-base">
    <ConversationItem
      v-for="(item, index) in conversationList"
      :key="index"
      :token="item.token!"
      :name="item.name!"
      :item-id="item.id!"
      :reload-conversation-list="getConversationsList"
    />
  </div>
</template>

<style scoped>
.conversations-list::-webkit-scrollbar {
  border: 0px;
  border-left: 1px solid #88888825 ;
  width: 4px;
}

.conversations-list::-webkit-scrollbar-thumb{
  border-radius: 6px;
  background: #88888850;
}
</style>
