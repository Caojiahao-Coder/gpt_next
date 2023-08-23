<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ConversationItem from '@/components/ConversationItem.vue'
import useConversationStore from '@/store/conversation-store'
import { formatTimestamp } from '@/utils/date-formatter'

const conversationStore = useConversationStore()

const showFixedTop = ref<boolean>(true)

const hideList = ref<string[]>([])

onMounted(() => {
  conversationStore.updateConversationsList(() => {
    const dateData = conversationStore.conversationsList.filter(a => formatTimestamp(a.create_time) !== formatTimestamp(Date.now()))
    hideList.value = dateData.map((a) => {
      return formatTimestamp(a.create_time)
    })
  })
})

const { t } = useI18n()

function toggleHideNormalList(date: string) {
  if (hideList.value.includes(date))
    hideList.value = hideList.value.filter(a => a !== date)
  else
    hideList.value.push(date)
}
</script>

<template>
  <div class="flex-1 conversations-list overflow-x-hidden overflow-y-scroll color-base">
    <template v-for="(item, index) in conversationStore.conversationsList" :key="index">
      <div v-if="index === 0 && (item.fixed_top ?? false)"
        class="flex flex-row p-x-4 p-y-2 text-3 bg-light-2 dark:bg-dark-9 b-0 b-solid b-b-1 border-base color-fade select-none"
        @click="showFixedTop = !showFixedTop">
        <div class="flex-1">
          {{ t('fixed_top') }} ( {{ conversationStore.conversationsList.filter(a => (a.fixed_top ?? false)).length }} )
        </div>
        <div class="w-14px h-14px icon-button" :class="showFixedTop ? 'i-carbon-chevron-down' : 'i-carbon-chevron-up'"
          data-cursor="block" />
      </div>
      <div
        v-if="!(item.fixed_top ?? false) && (index === 0 || (formatTimestamp(conversationStore.conversationsList[index - 1].create_time) !== formatTimestamp(item.create_time)) || ((item.fixed_top ?? false) === false && (conversationStore.conversationsList[index - 1].fixed_top ?? false)))"
        class="flex flex-row p-x-4 p-y-2 text-3 bg-light-2 dark:bg-dark-9 b-0 b-solid b-b-1 border-base color-fade select-none"
        @click="toggleHideNormalList(formatTimestamp(item.create_time))">
        <div flex-1>
          <span>
            {{ formatTimestamp(item.create_time) }}
          </span>
          <span>
            ( {{ conversationStore.conversationsList.filter(a => !(a.fixed_top ?? false) && formatTimestamp(a.create_time)
              === formatTimestamp(item.create_time)).length }} )
          </span>
        </div>
        <div class="icon-button w-14px h-14px"
          :class="hideList.includes(formatTimestamp(item.create_time)) ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"
          data-cursor="block" />
      </div>
      <template v-if="(item.fixed_top ?? false) ? showFixedTop : (
        !hideList.includes(formatTimestamp(item.create_time))
      )">
        <ConversationItem :conversation-info="item" />
      </template>
    </template>
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
