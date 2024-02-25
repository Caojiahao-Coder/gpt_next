<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PromptItem from './PromptItem.vue'
import type { NewPromptDetailInfo, NewPromptInfo, TBPromptInfo } from '@/database/table-type'
import promptController from '@/chat.prompt/PromptController'
import { push } from '@/main'

const props = defineProps<{
  promptInfo: TBPromptInfo | null
}>()

const { t } = useI18n()

interface PromptDetailItem {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const promptItems = ref<PromptDetailItem[]>([])

const title = ref<string>('')

watch(() => props.promptInfo, (newValue, _) => {
  if (newValue) {
    promptController.getPromptDetailByIdAsync(newValue.id).then((res) => {
      promptItems.value = res.map(item => ({
        role: item.role,
        content: item.content,
      } as PromptDetailItem))
    })

    title.value = newValue.title
  }
  else {
    title.value = ''
    promptItems.value = []
  }
})

function onAddNewItem() {
  promptItems.value.push({
    role: 'system',
    content: '',
  })
}

function updatePromptItemRole(index: number, role: 'system' | 'user' | 'assistant') {
  promptItems.value[index].role = role
}

function updatePromptItemContent(index: number, content: string) {
  promptItems.value[index].content = content
}

async function savePrompt(callback: (result: boolean) => void) {
  if (title.value.trim() === '') {
    push.error(t('please_input_prompt_title'))
    return
  }

  if (promptItems.value.length <= 0) {
    push.error(t('please_input_your_prompt'))
    return
  }

  if (props.promptInfo)
    callback(await updatePrompt())

  else
    callback(await createNewPrompt())
}

async function updatePrompt(): Promise<boolean> {
  const newPromptInfo = {
    id: props.promptInfo!.id,
    title: props.promptInfo!.title,
  } as TBPromptInfo

  const updatePromptResult = await promptController.updatePromptAsync(newPromptInfo)

  if (!updatePromptResult) {
    push.error(t('edit_prompt_failed'))
    return false
  }

  const deleteResult = await promptController.deletePromptDetailByPromptIdAsync(props.promptInfo!.id)

  if (!deleteResult) {
    push.error(t('edit_prompt_failed'))
    return false
  }

  const newData = []
  for (const item of promptItems.value) {
    newData.push({
      prompt_id: props.promptInfo!.id,
      role: item.role,
      content: item.content,
    } as NewPromptDetailInfo)
  }

  const result = await addPromptDetail(newData)

  if (!result)
    push.error(t('edit_prompt_failed'))
  else
    push.success(t('edit_prompt_success'))

  return result
}

async function createNewPrompt(): Promise<boolean> {
  const promptInfo = {
    title: title.value,
  } as NewPromptInfo

  const addPromptResult = await addNewPrompt(promptInfo)

  if (!addPromptResult.result) {
    push.error(t('add_prompt_failed'))
    return false
  }

  const newData = []
  for (const item of promptItems.value) {
    newData.push({
      prompt_id: addPromptResult.id,
      role: item.role,
      content: item.content,
    } as NewPromptDetailInfo)
  }

  const result = await addPromptDetail(newData)

  if (!result) {
    push.error(t('add_prompt_failed'))
    return false
  }

  push.success(t('add_prompt_success'))
  return true
}

async function addNewPrompt(info: NewPromptInfo): Promise<{ result: boolean; id: number }> {
  return await promptController.addPromptAsync(info)
}

async function addPromptDetail(promotDetail: NewPromptDetailInfo[]): Promise<boolean> {
  return await promptController.addPromptDetailAsync(promotDetail)
}

defineExpose({
  savePrompt,
})
</script>

<template>
  <div class="flex flex-col flex-1 overflow-hidden">
    <input v-model.trim="title" type="text" class="m-2 font-bold text-4 b-0 outline-none bg-base color-base" placeholder="Prompt Title">
    <div class=" b-0 b-t-1 border-base b-solid p-2 flex flex-col gap-2 overflow-y-auto">
      <PromptItem
        v-for="(item, index) in promptItems" :key="index" :role="item.role" :content="item.content"
        @on-remove="promptItems.splice(index, 1)" @on-role-change="updatePromptItemRole(index, $event)"
        @on-content-change="updatePromptItemContent(index, $event)"
      />
    </div>

    <button class="m-2 p-2 b-0 bg-blue b-rd color-white hover-bg-blue-6 transition-all" @click="onAddNewItem">
      + Add new prompt item.
    </button>
  </div>
</template>
