<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { TBPromptInfo } from '@/database/table-type'
import promptController from '@/chat.prompt/PromptController'

const props = defineProps<{
  onCloseCallback?: () => void
  open: boolean
}>()

const emits = defineEmits(['onSelectPrompt', 'onCloseSmartPanel'])

const open = ref<boolean>(props.open)

const panelRef = ref<HTMLDivElement>()

const promptList = ref<TBPromptInfo[]>([])

watch(() => props.open, (newValue) => {
  open.value = newValue
})

onMounted(() => {
  loadPromptList()
})

async function loadPromptList() {
  promptList.value = await promptController.loadPromptListAsync()
}

function onSelectPrompt(event: MouseEvent, item: TBPromptInfo) {
  event.stopPropagation()
  open.value = false
  emits('onSelectPrompt', item)
}
</script>

<template>
  <Transition>
    <div v-if="open" ref="panelRef" class="b-0 w-full b-b-1 border-base b-solid flex flex-row flex-wrap py-4 relative">
      <div
        v-for="(item, index) in promptList" :key="index"
        class="prompt-item b-rd-90 b-1 shadow-2xl py-2 px-4 hover-px-8 b-solid border-base cursor-pointer transition-all mx-2 color-base bg-body"
        @click="(event) => onSelectPrompt(event, item)"
      >
        {{ item.title }}
      </div>

      <div
        class="absolute i-carbon-close top-1 right-1 w-24px h-24px icon-button hover-color-red cursor-pointer"
        @click="() => emits('onCloseSmartPanel')"
      />
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.prompt-item:hover {
  box-shadow: 1px 2px 16px #00ffb330, -1px -2px 16px #00a2ff30;
}
</style>
