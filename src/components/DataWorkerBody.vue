<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as monaco from 'monaco-editor'
import { useI18n } from 'vue-i18n'
import { uid } from 'uid'
import Markdown from './Markdown.vue'
import DataWorkerModificationSuggestionItem from './DataWorkerModificationSuggestionItem.vue'
import DataWorker from './DataWorker.vue'
import type { NewMessageInfo, TBMessageInfo } from '@/database/table-type'
import useConversationStore from '@/store/conversation-store'
import useMessageStore from '@/store/message-store'
import { fetchChatCompletion } from '@/openai/api'
import useGlobalStore from '@/store/global-store'
import { parserStreamText } from '@/openai/parser'
import { isDark } from '@/store/dark'
import { push } from '@/main'
import { language } from '@/store/localstorage'
import Dialog from '@/ui/Dialog.vue'

const { t } = useI18n()

const openEditDialog = ref<boolean>(false)

const inputMessage = ref<string>('')

const inputRef = ref<HTMLTextAreaElement>()

const editorDiv = ref<HTMLDivElement>()

const openSQLDialog = ref<boolean>(false)

const loadingSqlCode = ref<boolean>(false)

const fullScreen = ref<boolean>(false)

const converstoreStore = useConversationStore()

const messageStore = useMessageStore()

const messageRecords = ref<TBMessageInfo[]>([])

const myColumns = ref<string[]>([])

const loading = ref<boolean>(false)

const dataSourceData = ref<string>('')

const previewSql = ref<string>('')

const bodyRef = ref<HTMLDivElement>()

let editor: any = null

onMounted(() => {
  loadMessageRecords()
})

function onCloseView() {
  openSQLDialog.value = false
}

function toggleFullScreen() {
  fullScreen.value = !fullScreen.value
}

function openPreviewSqlDialog() {
  if (loading.value) {
    push.warning(t('please_wait_for_data_to_be_generated'))
    return
  }
  if (!messageStore.messageList[0].gpt_content || messageStore.messageList[0].gpt_content === '') {
    push.warning(t('please_generate_data_first'))
    return
  }

  openSQLDialog.value = true
  initMonacoEditor()
}

function initMonacoEditor() {
  setTimeout(() => {
    // if the editor instance is already exist, dispose it
    if (editor)
      editor!.dispose()

    // if the editor div is exist, create a new editor instance
    if (editorDiv.value) {
      editor = monaco.editor.create(editorDiv.value, {
        automaticLayout: true,
        language: 'sql',
        theme: isDark.value ? 'vs-dark' : 'vs',
        minimap: {
          enabled: false,
        },
        value: previewSql.value,
        formatOnPaste: true,
        formatOnType: true,
        quickSuggestions: true,
        lineNumbers: 'off',
      })

      loadCreateTableSql()
    }
  }, 300)
}

async function loadMessageRecords() {
  const data = await messageStore.getMessageRecordsByConversationId(converstoreStore.conversationInfo!.id)
  messageRecords.value = data
  myColumns.value = data[0].user_content.split(';').filter(a => (a.trim()).length > 0)
  dataSourceData.value = data[data.length - 1].gpt_content
}

async function loadData() {
  loading.value = true

  dataSourceData.value = ''

  const messageData: {
    role: string
    content: string
  }[] = [{
    role: 'system',
    content: `
    You are now an assistant helping professionals generate test data. You have the following responsibilities:
      1. According to the column name listed by the user, the test data is generated as close as possible to the actual test data, but the real data is not used.
      2. You need to generate data according to the Markdown syntax, because the resulting result will be rendered as a Markdown table.
      3. Generate 10-20 pieces of data at a time.
      4. Remember, don't use the \`\`\` tag outside of Markdown Table code anymore!
      5. All columns should be merged into one table.

    The data you generate should be such as:

      "Some introduction to the data"
      |ID|Name|
      -----------
      |1|Leo|
      |2|Aeo|
      "Some summary statements"
    `,
  }, {
    role: 'user',
    content: `Here are all the column names:${myColumns.value.join(';')}`,
  }]

  if (language.value !== 'auto') {
    messageData.unshift({
      role: 'system',
      content: `Generate answers in English. ${language.value}.`,
    })
  }

  messageStore.messageList.filter((a, index) => index > 0).map(item =>
    messageData.push({
      role: 'user',
      content: item.user_content,
    }),
  )

  const globalStore = useGlobalStore()
  const globalSettingInfo = await globalStore.getGlobalSetting()

  try {
    const response = await fetchChatCompletion({
      apikey: globalSettingInfo.api_key,
      body: {
        model: globalSettingInfo.chat_model,
        top_p: 1,
        temperature: 0.7,
        messages: messageData,
        stream: true,
      },
    })

    await parserStreamText(response, (content) => {
      dataSourceData.value = dataSourceData.value + content
    }, (error) => {
      dataSourceData.value = error.error.message
    })

    setAnswerToMessageItem(messageRecords.value[messageRecords.value.length - 1], dataSourceData.value, 'finished')
  }
  catch (error) {

  }
  finally {
    loading.value = false
  }
}

async function loadCreateTableSql() {
  loadingSqlCode.value = true

  previewSql.value = ''

  const messageData: {
    role: string
    content: string
  }[] = [{
    role: 'system',
    content: `
    You are now an assistant helping professionals generate test data. You have the following responsibilities:
      1. Generate Sql scripts for SqlServer to run based on the Markdown data table code provided by the user.
      2. You need to make sure that the SQL script you generate can be run.
      3. The content you generate should be full SQL script and not Markdown content. Because it will be executed by the direct user code parser.
      4. Generate SQL scripts based on the provided data. Do not define your own SQL scripts.
      5. You need to make sure that you provide table building clauses and data insertion scripts.
    `,
  }, {
    role: 'user',
    content: `Markdown data table code: ${messageStore.messageList[0].gpt_content}`,
  }]

  const globalStore = useGlobalStore()
  const globalSettingInfo = await globalStore.getGlobalSetting()

  try {
    const response = await fetchChatCompletion({
      apikey: globalSettingInfo.api_key,
      body: {
        model: globalSettingInfo.chat_model,
        top_p: 1,
        temperature: 0.3,
        messages: messageData,
        stream: true,
      },
    })

    await parserStreamText(response, (content) => {
      previewSql.value = previewSql.value + content
      if (editor)
        editor.setValue(previewSql.value)
    }, (error) => {
      previewSql.value = error.error.message
    })
  }
  catch (error) {

  }
  finally {
    loadingSqlCode.value = false
    previewSql.value = extractSqlCode(previewSql.value).join('\r\n')
    editor.setValue(previewSql.value)
  }
}

function extractSqlCode(mdText: string): string[] {
  const pattern = /```sql([\s\S]*?)```/g

  const matches: string[] = []
  let match: RegExpExecArray | null

  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(mdText)) !== null)
    matches.push(match[1].trim())

  return matches
}

function extractMarkdownTableCode(mdText: string): string {
  const regex = /```(.*?)```/gs
  return mdText.replace(regex, (match, code) => code)
}

async function setAnswerToMessageItem(messageInfo: TBMessageInfo, content: string, status: 'finished' | 'error' | 'waiting') {
  const info: TBMessageInfo = {
    id: messageInfo.id,
    conversation_id: messageInfo.conversation_id,
    token_id: messageInfo.token_id,
    user_content: messageInfo.user_content,
    gpt_content: content,
    create_time: messageInfo.create_time,
    status,
  }

  await messageStore.updateMessageInfo(info)
}

function onCopySqlCode() {
  if (loadingSqlCode.value) {
    push.warning('Please wait for the code to be generated!')
    return
  }

  if (editor) {
    try {
      navigator.clipboard.writeText(editor.getValue())
      push.success('Copy success!')
    }
    catch (error) {
      push.error('Copy failed!')
    }
  }
}

function updateScroll() {
  if (bodyRef.value)
    bodyRef.value.scrollTop = bodyRef.value?.scrollHeight
}

/**
 * 发送一条新的消息
 * @param event
 */
function onKeyDownEnter(event: KeyboardEvent) {
  event.preventDefault()
  if (event.isComposing)
    return

  if (inputMessage.value.trim().length === 0) {
    push.warning(t('message_cannot_empty'))
    return
  }

  addNewModificationSuggestingMessage(inputMessage.value.toString().trim())

  inputMessage.value = ''
}

function addNewModificationSuggestingMessage(message: string) {
  const messageInfo: NewMessageInfo = {
    conversation_id: converstoreStore.conversationInfo!.id,
    user_content: message,
    gpt_content: '',
    create_time: Date.now(),
    token_id: uid(32),
    status: 'finished',
    vision_file: undefined,
  }

  messageStore.addNewMessage(messageInfo)

  setTimeout(() => {
    loadData()
  }, 120)
}

function downloadDataToCSV() {
  if (loading.value) {
    push.warning(t('please_wait_for_data_to_be_generated'))
    return
  }
  if (!dataSourceData.value || dataSourceData.value === '') {
    push.warning(t('please_generate_data_first'))
    return
  }
  try {
    const csvData = convertMarkdownTableContentToCSV(dataSourceData.value)
    const blob = new Blob([`\uFEFF${csvData}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    push.success(t('download_csv_successful'))
  }
  catch {
    push.error(t('download_csv_failed'))
  }
}

function downloadDataToJSON() {
  if (loading.value) {
    push.warning(t('please_wait_for_data_to_be_generated'))
    return
  }
  if (!dataSourceData.value || dataSourceData.value === '') {
    push.warning(t('please_generate_data_first'))
    return
  }

  try {
    const jsonData = convertMarkdownTableContentToJSON(dataSourceData.value)
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'data.json')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    push.success(t('download_json_successful'))
  }
  catch {
    push.error(t('download_json_failed'))
  }
}

function convertMarkdownTableContentToCSV(markdownContent: string) {
  let csvData: string = ''
  const markdownTableContent = extractMarkdownTableCode(markdownContent)
  const rows = markdownTableContent.split('\n').filter(a => a.trim().length > 0)

  let curRowIndex = 0

  for (let i = 0; i < rows.length; i++) {
    const columns = rows[i].split('|').filter((_, index) => index !== 0 && index !== (rows[i].split('|').length - 1))
    let myRowData = ''
    for (let j = 0; j < columns.length; j++) {
      if (j === 0)
        myRowData += columns[j].trim()
      else
        myRowData += `,"${columns[j].trim()}"`
    }
    if (myRowData.trim().length > 0) {
      if (curRowIndex !== 1)
        csvData += `${myRowData}\n`
      curRowIndex += 1
    }
  }

  return csvData
}

function convertMarkdownTableContentToJSON(markdownContent: string): string {
  const markdownTableContent = extractMarkdownTableCode(markdownContent)
  const rows = markdownTableContent.split('\n').filter(a => a.startsWith('|'))
  const header = rows[0].split('|').map(cell => cell.trim()).filter(cell => cell !== '')
  const data = rows.slice(2).map(row => row.split('|').map(cell => cell.trim()).filter(cell => cell !== ''))

  const jsonData = data.map((row) => {
    const jsonRow: { [key: string]: string } = {}
    header.forEach((key, index) => {
      jsonRow[key] = row[index]
    })
    return jsonRow
  })

  return JSON.stringify(jsonData, null, 2)
}

function openEditColumnsDialog() {
  openEditDialog.value = true
}

async function submitEditColumnsData(columns: string[]) {
  if (columns.length === 0) {
    push.warning(t('please_add_at_least_one_column'))
    return
  }

  const messageInfo = messageStore.messageList[0]

  const info: TBMessageInfo = {
    id: messageInfo.id,
    conversation_id: messageInfo.conversation_id,
    token_id: messageInfo.token_id,
    user_content: columns.join(';'),
    gpt_content: '',
    create_time: messageInfo.create_time,
    status: 'waiting',
  }

  await messageStore.updateMessageInfo(info)

  loadMessageRecords()

  openEditDialog.value = false
}
</script>

<template>
  <div class="overflow-y-scroll overflow-x-hidden h-100% root-scroll-view">
    <div class="bg-base color-base">
      <div class="data-source flex flex-row p-x-4 p-y-2 b-solid border-base b-0 b-b-1 flex flex-row gap-2">
        <div class="flex-1 h-36px line-height-36px">
          {{ t('data_columns') }}
        </div>

        <div
          class="bg-body b-solid b-1 border-base p-x-4 p-y-1 b-rd hover-bg-base h-26px shadow"
          @click="openEditColumnsDialog"
        >
          <div class="h-100% text-5 i-carbon-edit" />
        </div>
      </div>

      <div class=" border-base gap-16px relative p-4" b="0 b-1 solid">
        <ul style="line-height: 40px;" class="m-0">
          <li v-for="(item, index) in myColumns" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div ref="bodyRef" class="bg-base color-base">
      <div class="edit-list p-x-4 p-y-2 b-solid border-base b-0 b-b-1">
        {{ t('modification_suggestion') }}
      </div>
      <div>
        <DataWorkerModificationSuggestionItem
          v-for="(item, index) in messageStore.messageList.filter((item, index) => index > 0)" :key="index"
          :message-info="item" :scroll-body="updateScroll"
        />
      </div>

      <div class="input-root-view flex flex-row p-24px bg-base b-0 b-solid b-b-1 border-base">
        <textarea
          ref="inputRef" v-model="inputMessage" data-cursor="text" :disabled="loading"
          overflow="x-hidden y-scroll"
          :placeholder="loading === true ? t('loading') : t('data_worker_enter_modification')"
          class="bg-transparent b-0 outline-none color-base text-4 p-0 m-0 line-height-31px flex-1 h-31px focus-h-120px transition-all"
          @keydown.enter="onKeyDownEnter"
        />
      </div>
    </div>

    <div class="data-view bg-base b-solid border-base b-0 b-b-1 color-base">
      <div class="data-source p-x-4 p-y-2 b-solid border-base b-0 b-b-1 flex flex-row gap-2">
        <div class="flex-1 line-height-36px">
          {{ t('data_result') }}
        </div>

        <div class="bg-body b-solid b-1 border-base p-x-4 p-y-1 b-rd hover-bg-base shadow" @click="openPreviewSqlDialog">
          <div class="h-100% text-8 i-carbon-sql" />
        </div>

        <div class="bg-body b-solid b-1 border-base p-x-4 p-y-0 b-rd hover-bg-base shadow" @click="downloadDataToJSON">
          <div class="h-100% text-8 i-carbon-json" />
        </div>

        <div class="bg-body b-solid b-1 border-base p-x-4 p-y-1 b-rd hover-bg-base shadow" @click="downloadDataToCSV">
          <div class="h-100% text-8 i-carbon-csv" />
        </div>

        <button
          class="b-1 b-rd b-solid border-base bg-body hover-bg-base color-base outline-none p-x-4 p-y-2 flex flex-row gap-2 shadow"
          @click="loadData"
        >
          <div v-if="loading" class="line-height-18px i-svg-spinners-180-ring h-18px" />
          {{
            loading ? t('loading') : t('load_data')
          }}
        </button>
      </div>

      <div id="data-work-markdown" class="pb-6 bg-base mt-4 p-4">
        <Markdown :content="dataSourceData" />
      </div>
    </div>
  </div>

  <Transition>
    <div v-if="openSQLDialog" class="fixed top-0 left-0 w-full h-100vh backdrop-blur z-100 flex-col flex color-base">
      <div :class="[fullScreen ? 'h-16px' : 'h-20%']" class="transition-duration-.2s" @click="onCloseView" />
      <div class="flex flex-row" :class="fullScreen ? 'h-100%' : 'h-600px'">
        <div :class="[fullScreen ? 'w-16px' : 'w-25%']" class="transition-duration-.2s" @click="onCloseView" />
        <div class="border-base b-rd b-1 b-solid bg-base flex-1 flex flex-col overflow-hidden flex-1">
          <div class="p-4 flex flex-row b-0 b-b-1 b-solid border-base">
            <div class="flex-1 text-5">
              {{ t('generate_sql_code') }}
            </div>
            <div class="flex flex-row gap-2">
              <div
                class="icon-button" :class="[
                  fullScreen ? 'i-carbon-minimize' : 'i-carbon-maximize',
                ]" @click="toggleFullScreen"
              />

              <div class="icon-button i-carbon-close h-24px w-24px" @click="openSQLDialog = false" />
            </div>
          </div>

          <div class="flex flex-col flex-1">
            <div class="b-0 b-b-1 b-solid border-base flex flex-row gap-2 h-32px p-x-1">
              <div v-if="loadingSqlCode" class="h-16px w-16px line-height-16px p-y-8px i-svg-spinners-180-ring" />
              <div class="line-height-32px">
                {{ loadingSqlCode ? 'Loading...' : '' }}
              </div>

              <div class="flex-1 flex flex-row-reverse gap-2">
                <div
                  class="w-24px h-24px b-1 b-solid border-base b-rd bg-body m-y-3px bg-body hover-bg-base"
                  @click="onCopySqlCode"
                >
                  <div class=" m4px i-carbon-copy" />
                </div>
              </div>
            </div>
            <div ref="editorDiv" class="flex-1 w-100% h-full" />
          </div>
        </div>
        <div :class="[fullScreen ? 'w-16px' : 'w-25%']" class="transition-duration-.2s" @click="onCloseView" />
      </div>
      <div :class="[fullScreen ? 'h-16px' : 'h-20%']" class="transition-duration-.2s" @click="onCloseView" />
    </div>
  </Transition>

  <Dialog title="Mock Data" :open="openEditDialog" @on-close="openEditDialog = false">
    <div class="font-light mb-4 color-base text-4">
      {{ t('data_tools_desc') }}
    </div>

    <DataWorker
      :columns="myColumns" @on-close="openEditDialog = false"
      @on-submit="(columns) => submitEditColumnsData(columns)"
    />
  </Dialog>
</template>

<style scoped>
.data-view {
  position: relative;
  overflow: hidden;
}

.data-view::after {
  position: absolute;
  content: '';
  width: 10px;
  height: 10px;
  background-color: aqua;
  filter: blur(23px);
}

html.dark .data-source {
  background: linear-gradient(251deg, rgba(174, 26, 26, 0.20) 0%, rgba(62, 8, 67, 0.11) 49.52%, rgba(27, 2, 35, 0.20) 100%), rgba(17, 17, 17, 0.90);
}

.data-source {
  background: linear-gradient(112deg, rgba(155, 216, 228, 0.20) 33.17%, rgba(213, 179, 133, 0.20) 100%), linear-gradient(257deg, rgba(49, 89, 81, 0.20) 16.24%, rgba(181, 88, 70, 0.20) 73.46%), rgba(255, 255, 255, 0.90);
}

html.dark .edit-list {
  background: linear-gradient(251deg, rgba(174, 26, 26, 0.20) 0%, rgba(62, 8, 67, 0.11) 49.52%, rgba(27, 2, 35, 0.20) 100%), rgba(17, 17, 17, 0.90);
}

.edit-list {
  background: linear-gradient(112deg, rgba(155, 216, 228, 0.20) 33.17%, rgba(213, 179, 133, 0.20) 100%), linear-gradient(257deg, rgba(49, 89, 81, 0.20) 16.24%, rgba(181, 88, 70, 0.20) 73.46%), rgba(255, 255, 255, 0.90);
}

.input-root-view {
  background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%204096%204096%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22x37ws8lk43i60c%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221%22%20numOctaves%3D%222.8%22%20stitchTiles%3D%22stitch%22%20%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23x37ws8lk43i60c)%22%20opacity%3D%220.1%22%20%2F%3E%3C%2Fsvg%3E');
}

.root-scroll-view::-webkit-scrollbar {
  display: none;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

textarea::-webkit-scrollbar {
  display: none;
}
</style>
