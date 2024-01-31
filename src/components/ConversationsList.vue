<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ConversationGroupList from './ConversationGroupList.vue'
import useConversationStore from '@/store/conversation-store'
import { formatTimestamp } from '@/utils/date-formatter'
import type { TBConverstationInfo } from '@/database/table-type'

const conversationStore = useConversationStore()

const { t } = useI18n()

const groupList = ref<string[]>([])

onMounted(() => {
  conversationStore.loadConversationList().then(res => loadConversationGroupList(res))
})

watch(() => conversationStore.conversationsList, (newValue, _) => {
  loadConversationGroupList(newValue)
})

function loadConversationGroupList(conversationList: TBConverstationInfo[]) {
  const newGroupList = conversationList.filter(a => a.fixed_top ?? false).length > 0 ? [t('fixed_top')] : []

  for (const item of conversationList) {
    const date = formatTimestamp(item.create_time)
    if (!newGroupList.includes(date))
      newGroupList.push(date)
  }

  groupList.value = newGroupList
}
</script>

<template>
  <div class="conversations-list flex-1 overflow-x-hidden overflow-y-scroll color-base flex flex-col gap1 p-t1">
    <ConversationGroupList
      v-for="(item, index) in groupList"
      :key="index" :group-title="item" :default-open="item === t('fixed_top') || item === formatTimestamp(Date.now())"
      :conversation-list="item === t('fixed_top') ? conversationStore.conversationsList.filter(a => a.fixed_top ?? false) : conversationStore.conversationsList.filter(a => formatTimestamp(a.create_time) === item && !(a.fixed_top ?? false))"
    />
  </div>
</template>

<style scoped>
.conversations-list::-webkit-scrollbar {
  display: none;
  border: 0px;
  border-left: 1px solid #88888825;
  width: 4px;
}

.conversations-list::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: #88888850;
}
</style>
