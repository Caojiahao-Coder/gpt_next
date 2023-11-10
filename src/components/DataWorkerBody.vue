<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as monaco from 'monaco-editor'
import { useI18n } from 'vue-i18n'
import Markdown from './Markdown.vue'
import type { TBMessageInfo } from '@/database/table-type'
import useConversationStore from '@/store/conversation-store'
import useMessageStore from '@/store/message-store'
import { fetchChatCompletion } from '@/openai/api'
import useGlobalStore from '@/store/global-store'
import { parserStreamText } from '@/openai/parser'
import { isDark } from '@/store/dark'
import { push } from '@/main'
import { language } from '@/store/localstorage'

const { t } = useI18n()

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
  myColumns.value = data[0].user_content.split(';')
  dataSourceData.value = data[0].gpt_content
}

async function loadData() {
  loading.value = true

  dataSourceData.value = ''

  const messageData: {
    role: string
    content: string
  }[] = [{
    role: 'system',
    content: 'You are a data analyst, and you need to create a table based on the data you have. And you need generate raw markdown table data, not markdown table code!',
  }, {
    role: 'user',
    content: 'I will give you the list, and I hope you can create some test data from this list for me.',
  }, {
    role: 'assistant',
    content: 'Ok, I\'m going to combine this breakdown closely to create some test data for you.',
  }, {
    role: 'user',
    content: 'I want the generated data to use Markdown\'s tabular format. Make sure you don\'t use code notation because I need to render directly into the table style in Markdown rendering.',
  }, {
    role: 'assistant',
    content: 'Ok, I\'m going to generate the data in Markdown Table format.',
  }, {
    role: 'user',
    content: 'A minimum of 6 and a maximum of 20 pieces of data are generated.Bastard! I want to generate 15 pieces of data.',
  }, {
    role: 'assistant',
    content: 'Ok, I will generate data according to the number of data strips.',
  }, {
    role: 'user',
    content: myColumns.value.join(';'),
  }]

  if (language.value !== 'auto') {
    messageData.unshift({
      role: 'system',
      content: `All answers are in the following language: ${language.value}.`,
    })
  }

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

    dataSourceData.value = extractMarkdownTableCode(dataSourceData.value)

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
    content: 'You are a SQL analyst, and you need to create a sql script with the data you have.',
  }, {
    role: 'user',
    content: 'Now, I\'ll give you a list that contains all the column names of a data table.',
  }, {
    role: 'assistant',
    content: 'Ok, I\'m going to combine this breakdown closely to create a table for you.',
  }, {
    role: 'user',
    content: `Here is the list of data columns: ${myColumns.value.join(';')}}`,
  }, {
    role: 'assistant',
    content: 'Ok, I already know all the columns of your data table.',
  }, {
    role: 'user',
    content: 'Create a Sql Server table builder clause based on these columns, so that it follows the higher paradigm design as much as possible.',
  },
  {
    role: 'user',
    content: 'Now, I will provide you with a Markdown text, this text contains some dialogue content and the test data of this data table, please parse this Markdown text, and extract the data from the data table, and generate the corresponding insert statement according to the Sql table construction clause you created.',
  },
  {
    role: 'assistant',
    content: 'Ok, please provide me with your Markdown text.',
  },
  {
    role: 'user',
    content: `Here's my Markdown text: ${dataSourceData.value}`,
  },
  {
    role: 'assistant',
    content: 'I see. Please tell me what you need and I\'ll give you an answer as required.',
  }, {
    role: 'user',
    content: 'I need you to create an Sql script based on all of the above requirements that satisfies all of the above conditions. Remember! I just need a separate Sql code, not wrapped in Markdown language, and I don\'t need too much explanation, because I need to render this answer directly into Sql.',
  }, {
    role: 'assistant',
    content: 'Ok, I\'m just going to help you generate an sql code without any Markdown format.',
  }, {
    role: 'user',
    content: 'Ok, thank you. Please follow the instructions to the letter. Let\'s get started.',
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
</script>

<template>
  <div class="overflow-y-scroll overflow-x-hidden h-100% root-scroll-view">
    <div class="bg-base color-base">
      <div class="data-source p-x-4 p-y-2 b-solid border-base b-0 b-b-1">
        Data Columns
      </div>
      <div class=" border-base gap-16px relative p-4" b="0 b-1 solid">
        <ul style="line-height: 40px;" class="m-0">
          <li v-for="(item, index) in myColumns" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div class="data-view bg-base b-solid border-base b-0 b-b-1 color-base">
      <div class="data-source p-x-4 p-y-2 b-solid border-base b-0 b-b-1 flex flex-row gap-2">
        <div class="flex-1 line-height-36px">
          Data Source
        </div>

        <div class="bg-body b-solid b-1 border-base p-x-4 p-y-1 b-rd hover-bg-base" @click="openPreviewSqlDialog">
          <div class="h-100% text-8 i-carbon-sql" />
        </div>

        <button
          class="b-1 b-rd b-solid border-base bg-body hover-bg-base color-base outline-none p-x-4 p-y-2 flex flex-row gap-2"
          @click="loadData"
        >
          <div v-if="loading" class="line-height-18px i-svg-spinners-180-ring h-18px" />
          {{
            loading ? t('loading') : t('load_data')
          }}
        </button>
      </div>

      <div id="data-work-markdown" class="p-x-4 pb-8 bg-base mt-4">
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
              Generate sql code
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
  </transition>
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
</style>
