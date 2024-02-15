<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { push } from '@/main'
import type { TBPromptInfo } from '@/database/table-type'
import promptController from '@/chat.prompt/PromptController'
import PromptEditor from '@/components/PromptEditor.vue'

const emits = defineEmits(['onClose'])

const { t } = useI18n()

const promptList = ref<TBPromptInfo[]>([])

const currentPrompt = ref<TBPromptInfo | null>(null)

const promptEditorRef = ref<any>(null)

onMounted(() => {
  loadPromptList()
})

function loadPromptList() {
  promptController.loadPromptListAsync().then(res => promptList.value = res)
}

function onClose() {
  emits('onClose')
}

function selectPrompt(info: TBPromptInfo) {
  currentPrompt.value = info
}

function onDeletePrompt(event: MouseEvent, info: TBPromptInfo) {
  promptController.deletePromptAsync(info.id).then((res) => {
    if (res) {
      push.success(t('delete_prompt_success'))
      loadPromptList()
    }
    else {
      push.error(t('delete_prompt_failed'))
    }
  })
}

function onSavePrompt() {
  promptEditorRef.value.savePrompt((result: boolean) => {
    if (result)
      loadPromptList()
  })
}

function onAddNewPrompt() {
  currentPrompt.value = null
}
</script>

<template>
  <div class="h-full min-h-400px flex flex-row relative overflow-hidden">
    <div class="w-260px h-full b-0 b-r-1 b-solid border-base">
      <ul class="list-none p-0 m-0">
        <li
          v-for="(item, index) in promptList" :key="index"
          class="px-2 py-3 b-1 b-solid border-base m-3 b-rd bg-base cursor-pointer transition-all flex flex-row" :class="[
            (item.id === currentPrompt?.id ?? -1) ? 'bg-body' : 'bg-base',
          ]" @click="selectPrompt(item)"
        >
          <div class="flex-1">
            {{ item.title }}
          </div>
          <div class="icon-button color-red w-22px h-22px i-carbon-close" @click="(e) => onDeletePrompt(e, item)" />
        </li>

        <li
          class="px-4 py-3 b-1 b-solid border-base m-3 b-rd bg-base cursor-pointer hover-bg-body transition-all"
          @click="onAddNewPrompt"
        >
          <div class="flex flex-row gap-2">
            <div class="h-22px w-22px line-height-22px i-carbon-add" />
            <div>Add new prompt</div>
          </div>
        </li>
      </ul>
    </div>
    <div id="view-content" class="flex-1 flex flex-col overflow-y-scroll">
      <PromptEditor ref="promptEditorRef" :prompt-info="currentPrompt" />

      <div class="flex flex-row-reverse gap-2 p-2 b-0 b-t-1 b-solid border-base">
        <button
          class="bg-red-6 color-white color-base outline-none border-base hover-bg-red-7 transition-all px-4 py-2 b-1 b-solid border-base b-rd"
          @click="onClose"
        >
          {{ t('cancel') }}
        </button>

        <button
          class="bg-green-6 color-white color-base outline-none border-base hover-bg-green-7  transition-all px-4 py-2 b-1 b-solid border-base b-rd"
          @click="onSavePrompt"
        >
          {{ t('save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#view-content::-webkit-scrollbar {
  display: none;
}
</style>
