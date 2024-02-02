<script setup lang="ts">
import { ref } from 'vue'
import ConversationItem from './ConversationItem.vue'
import type { TBConverstationInfo } from '@/database/table-type'
import useConversationStore from '@/store/conversation-store'
import { formatTimestamp } from '@/utils/date-formatter'

const props = defineProps<{
  groupTitle: string
  conversationList: TBConverstationInfo[]
  defaultOpen: boolean
}>()

const showGroup = ref<boolean>(
  formatTimestamp(useConversationStore().conversationInfo?.create_time ?? 0) === props.groupTitle
  || props.defaultOpen)
</script>

<template>
  <div class="m-x-1 b-rd b-1 b-solid border-base">
    <div class="p2 bg-body flex flex-row gap-2 b-rd-t" :class="showGroup ? 'b-b-1 b-0 border-base b-solid' : 'b-rd-b'" @click="showGroup = !showGroup">
      <div class="flex-1">
        {{ groupTitle }}
      </div>
      <div class="h-22px w-22px line-height-22px" :class="!showGroup ? 'i-carbon-chevron-down' : 'i-carbon-chevron-up'" />
    </div>

    <div v-show="showGroup">
      <ConversationItem
        v-for="(item, index) in conversationList"
        :key="index"
        :conversation-info="item"
      />
    </div>
  </div>
</template>
