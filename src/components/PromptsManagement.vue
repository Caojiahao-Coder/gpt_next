<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref, watch } from 'vue'
import Markdown from './Markdown.vue'
import usePromptStore from '@/store/prompt-store'
import { push } from '@/main'
import type { NewPromptDetailInfo, TBPromptDetailInfo, TBPromptInfo } from '@/database/table-type'
import PromptItem from '@/components/PromptItem.vue'
import { fetchChatCompletion } from '@/openai/api'
import useGlobalStore from '@/store/global-store'
import { parserStreamText } from '@/openai/parser'

const emits = defineEmits(['onClose'])

const promptStore = usePromptStore()

const { t } = useI18n()

const title = ref<string>(promptStore.currentPrompt?.title ?? '')

const promptDetailList = ref<TBPromptDetailInfo[]>([])

const showTestResult = ref<boolean>(false)

const testResult = ref<string>('')

const testMessage = ref<string>('')

const testing = ref<boolean>(false)

onMounted(() => {
  promptStore.loadPromptList()
})

watch(() => promptStore.currentPrompt, (newValue) => {
  title.value = newValue?.title ?? ''
  if (promptStore.currentPrompt)
    promptDetailList.value = promptStore.promptDetail
  else
    promptDetailList.value = []
  testMessage.value = ''
  testResult.value = ''
  showTestResult.value = false
})

watch(() => promptStore.promptDetail, (newValue) => {
  promptDetailList.value = newValue
})

function onClose() {
  emits('onClose')
}

function selectPrompt(info: TBPromptInfo) {
  promptStore.currentPrompt = info
  title.value = info.title
}

function createNewPrompt() {
  promptStore.currentPrompt = null
}

function onSavePrompt() {
  if (!promptStore.currentPrompt)
    saveNewPrompt()
  else
    editPrompt()
}

async function saveNewPrompt() {
  if (title.value.trim() === '') {
    push.warning(t('prompt_info_can_not_empty'))
    return
  }

  const result = await promptStore.addNewPrompt({
    title: title.value,
    create_time: new Date().getTime(),
    is_deleted: false,
  })

  if (result > 0) {
    const data: NewPromptDetailInfo[] = []
    promptDetailList.value.map(item => data.push({
      prompt_id: result,
      role: item.role,
      content: item.content,
      is_deleted: false,
    }))
    const addDetailResult = await promptStore.addPromptDetail(data)
    if (addDetailResult)
      push.success(t('add_prompt_success'))
    else
      push.error(t('add_prompt_failed'))
  }

  else { push.error(t('add_prompt_failed')) }
}

async function editPrompt() {
  if (title.value.trim() === '') {
    push.warning(t('prompt_info_can_not_empty'))
    return
  }

  const info = promptStore.currentPrompt

  if (!info) {
    push.error(t('prompt_info_not_found'))
    return
  }

  const result = await promptStore.updatePromptInfo(
    {
      id: info.id,
      title: title.value,
      create_time: info?.create_time ?? new Date().getTime(),
      is_deleted: info?.is_deleted ?? false,
    } as TBPromptInfo,
  )

  if (result === false) {
    push.error(t('edit_prompt_failed'))
    return
  }

  promptStore.clearPromptDetailById(info.id).then(async (res) => {
    const data: NewPromptDetailInfo[] = []
    promptDetailList.value.map(item => data.push({
      prompt_id: info.id,
      role: item.role,
      content: item.content,
      is_deleted: false,
    }))
    const addDetailResult = await promptStore.addPromptDetail(data)
    if (addDetailResult)
      push.success(t('add_prompt_success'))
    else
      push.error(t('add_prompt_failed'))
  })
}

function onDeletePrompt(event: MouseEvent, info: TBPromptInfo) {
  event.stopPropagation()
  const result = confirm(t('confirm_delete_prompt'))
  if (!result)
    return

  promptStore.deletePromptById(info.id).then((res) => {
    if (res)
      push.success(t('delete_prompt_success'))
    else
      push.error(t('delete_prompt_failed'))
  })
}

function onAddNewPrompt() {
  promptDetailList.value.push({
    id: -1,
    prompt_id: promptStore.currentPrompt?.id ?? -1,
    role: 'system',
    content: '',
    is_deleted: false,
  })
}

function onDeletePromptItem(index: number) {
  promptDetailList.value.splice(index, 1)
}

function onRoleChange(index: number, value: string) {
  promptDetailList.value[index].role = value as 'system' | 'user' | 'assistant'
}

function onContentChange(index: number, value: string) {
  promptDetailList.value[index].content = value
}

function onEditorEnter(event: KeyboardEvent) {
  const textarea = event.target as HTMLTextAreaElement
  // shift + ctrl
  if (event.shiftKey && event.keyCode === 13) {
    event.preventDefault()
    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    const oldValue = textarea.value
    textarea.value = `${oldValue.substring(0, startPos)}\n${oldValue.substring(endPos)}`
    textarea.selectionStart = textarea.selectionEnd = startPos + 1
  }
  // enter key
  else if (event.keyCode === 13) {
    event.preventDefault()
    if (event.isComposing)
      return
    testPrompt()
  }
}

function testPrompt() {
  if (testMessage.value.trim().length === 0) {
    push.warning(t('please_input_test_message'))
    return
  }
  showTestResult.value = true
  testing.value = true
  testResult.value = ''
  sendTestMessage()
}

async function sendTestMessage() {
  const messages: {
    role: 'user' | 'system' | 'assistant'
    content: string
  }[] = []

  promptDetailList.value.map(item => messages.push({
    role: item.role,
    content: item.content,
  }))

  messages.push({
    role: 'user',
    content: testMessage.value,
  })

  const globalSettingInfo = await useGlobalStore().getGlobalSetting()

  const response = await fetchChatCompletion({
    apikey: globalSettingInfo.api_key,
    body: {
      model: globalSettingInfo.chat_model,
      top_p: 1,
      temperature: 0.7,
      messages,
      stream: true,
    },
  })

  if (!response)
    return

  parserStreamText(response, (content) => {
    testResult.value += content
  }, (err) => { testResult.value = err.error.message }).finally(() => {
    testing.value = false
  })
}
</script>

<template>
  <div class="h-full min-h-400px flex flex-row relative overflow-hidden">
    <div class="w-260px h-full b-0 b-r-1 b-solid border-base">
      <ul class="list-none p-0 m-0">
        <li
          v-for="(item, index) in promptStore.promptList" :key="index"
          class="px-2 py-3 b-1 b-solid border-base m-3 b-rd bg-base cursor-pointer transition-all flex flex-row" :class="[
            (item.id === promptStore.currentPrompt?.id ?? -1) ? 'bg-body' : 'bg-base',
          ]" @click="selectPrompt(item)"
        >
          <div class="flex-1">
            {{ item.title }}
          </div>
          <div class="icon-button color-red w-22px h-22px i-carbon-close" @click="(e) => onDeletePrompt(e, item)" />
        </li>

        <li
          class="px-4 py-3 b-1 b-solid border-base m-3 b-rd bg-base cursor-pointer hover-bg-body transition-all"
          @click="createNewPrompt"
        >
          <div class="flex flex-row gap-2">
            <div class="h-22px w-22px line-height-22px i-carbon-add" />
            <div>Add new prompt</div>
          </div>
        </li>
      </ul>
    </div>
    <div id="view-content" class="flex-1 flex flex-col overflow-y-scroll">
      <div class="flex-1 p-2">
        <div class="flex flex-row">
          <input
            v-model.trim="title" type="text"
            class="b-1 b-solid border-base p-2 b-rd outline-none text-5 font-bold flex-1 bg-base focus-bg-body color-base"
            :placeholder="t('please_input_prompt_title')"
          >
        </div>
        <div class="flex flex-col gap-2 mt-2">
          <PromptItem
            v-for="(item, index) in promptDetailList" :key="index" v-model:role="item.role"
            v-model:content="item.content" @on-remove="onDeletePromptItem(index)"
            @on-role-change="(value) => onRoleChange(index, value)"
            @on-content-change="(value) => onContentChange(index, value)"
          />
        </div>

        <div class="b-1 b-solid border-base p-2 b-rd hover-bg-body mt-2" @click="onAddNewPrompt">
          <div class="w-36px h-36px m-auto icon-button i-carbon-add" />
        </div>

        <div class="b-1 b-solid border-base b-rd mt-2 bg-body overflow-hidden">
          <div class="font-bold p-4 b-0 b-b-1 b-solid border-base flex flex-row">
            <div class="flex-1 line-height-36px">
              Test this prompt
            </div>

            <button
              class="bg-base hover-bg-body transition-all b-rd b-1 b-rd b-solid border-base p-2 flex flex-row color-base"
              :disabled="testing" @click="testPrompt"
            >
              {{
                testing ? 'Testing...' : 'Test'
              }}
            </button>
          </div>

          <div class="flex flex-col">
            <textarea
              v-model.trim="testMessage"
              class="outline-none b-0 resize-none min-h-230px flex-1 p-4 text-4 color-base bg-base focus-bg-body"
              placeholder="Please input test message" @keydown="onEditorEnter"
            />

            <div v-if="showTestResult" class="flex flex-row b-0 b-t-1 b-solid border-base">
              <div class="flex-1 bg-base">
                <div class="font-bold b-0 b-b-1 b-solid border-base p-4 bg-body">
                  {{ t('test_result') }}
                </div>
                <div class="p-2 flex flex-col gap-2">
                  <div v-if="testing" class="p-2 b-1 b-solid border-base b-rd flex flex-row gap-2 bg-body">
                    <div class="i-svg-spinners-blocks-shuffle-3 m-3px" />
                    <div>
                      {{ t('loading_test_result') }}
                    </div>
                  </div>
                  <Markdown :content="testResult" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
