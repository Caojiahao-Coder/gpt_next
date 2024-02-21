<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import html2canvas from 'html2canvas'
import { uid } from 'uid'
import EditMessageRecordTools from './EditMessageRecordTools.vue'
import CheckingFunctionCalling from './CheckingFunctionCalling.vue'
import MarkFunctionCallingMessage from './MarkFunctionCallingMessage.vue'
import WaitingForFunctionCallingResponse from './WaitingForFunctionCallingResponse.vue'
import type { TBMessageInfo } from '@/database/table-type'
import Markdown from '@/components/Markdown.vue'
import useEditorStore from '@/store/editor-store'
import Dialog from '@/ui/Dialog.vue'
import { useMessageSpeechStore } from '@/store/message-speech-store'
import { push } from '@/main'
import GPTVisionList from '@/components/GPTVisionList.vue'
import useChatCompletionStore from '@/store/chat-completion-store'
import chatFunctionCallingController from '@/chat.function.calling/ChatFunctionCallingController'
import getFunctionResultByFunctionName from '@/openai/handler/FunctionHandler'
import messageController from '@/chat.completion/MessageController'

const props = defineProps<{
  messageIndex: number
  messageInfo: TBMessageInfo
  scrollBody: () => void
}>()

const events = defineEmits(['onReloadMessageList'])

const chatCompletionStore = useChatCompletionStore()

const editorStore = useEditorStore()

const showTools = ref<boolean>(false)

const openDeleteConfirmDialog = ref<boolean>(false)

const openEditMessageDialog = ref<boolean>(false)

const messageContent = ref<string>(props.messageInfo.user_content)

const messageRef = ref<HTMLDivElement>()

const { t } = useI18n()

const messageInfo = ref<TBMessageInfo>(props.messageInfo)

const gptContent = ref<string>('')

const speeching = ref<boolean>(false)

const gptMessageSpeechStatus = ref<'pending' | 'processing' | 'finished'>('finished')

const checkingFunctionCalling = ref<boolean>(false)

const useFunctionCalling = ref<boolean>(false)

const useFunctionName = ref<string>('')

const useFunctionDescription = ref<string>('')

const loadingMessageAnswer = ref<boolean>(false)

const waitingFunctionResult = ref<boolean>(false)

onMounted(() => {
  loadMessageRecordResult()
})

function loadMessageRecordResult() {
  switch (messageInfo.value.status) {
    case 'waiting':
      getAnswer(messageInfo.value.id)
      break
    case 'finished':
      gptContent.value = messageInfo.value.gpt_content
      break
    case 'error':
      break
  }
}

/**
 * 获取对话的答案
 */
async function getAnswer(messageId: number) {
  gptContent.value = ''
  checkingFunctionCalling.value = true
  let needGetFunctionResult = false
  if (chatCompletionStore.chatCompletionHandler?.getConversationInfo().use_groq ?? false) {
    getAnswerByGroq(messageId)
  }
  else {
    await chatCompletionStore.chatCompletionHandler?.getMessageAnswerAsync(messageId, (value) => {
      gptContent.value += value
      scrollBody()
    }, (tool_call_id, functionName, args, _) => {
      needGetFunctionResult = true
      handleFunction(tool_call_id, functionName, args)
    })
    if (!needGetFunctionResult) {
      checkingFunctionCalling.value = false
      reloadMessageInfoFromDB()
      if (props.messageIndex === 0)
        chatCompletionStore.chatCompletionHandler?.getChatCompletionTitleFromMessageAsync(messageInfo.value.id)
    }
  }
}

async function getAnswerByGroq(messageId: number) {
  await chatCompletionStore.chatCompletionHandler?.getMessageAnswerByGroqAsync(messageId, (value) => {
    gptContent.value += value
    scrollBody()
  })
}

/**
 * 处理函数
 * @param tool_call_id
 * @param functionName
 * @param args
 */
async function handleFunction(tool_call_id: string, functionName: string, args: string) {
  checkingFunctionCalling.value = false
  useFunctionCalling.value = true
  waitingFunctionResult.value = true

  const functionInfo = chatFunctionCallingController.getTools().find(item => item.function.name === functionName)

  useFunctionName.value = t(`functionCallingList.${functionInfo?.function.name}`)
  useFunctionDescription.value = t(`functionCallingList.${functionInfo?.function.description}`)

  const functionResult = await getFunctionResultByFunctionName(functionName, args)
  waitingFunctionResult.value = false

  gptContent.value = ''

  const result = await chatCompletionStore.chatCompletionHandler?.getMessageAnswerFromFunctionResultAsync(
    messageInfo.value.id,
    tool_call_id,
    functionName,
    functionInfo?.function.description ?? '',
    args,
    functionResult,
    value => gptContent.value += value,
  )

  if (result)
    reloadMessageInfoFromDB()

  if (props.messageIndex === 0)
    chatCompletionStore.chatCompletionHandler?.getChatCompletionTitleFromMessageAsync(messageInfo.value.id)
}

/**
 * 重载 Message 的 Function 信息
 */
async function reloadMessageInfoFromDB() {
  messageController.getMessageInfoByIdAsync(messageInfo.value.id).then((res) => {
    messageInfo.value = res as TBMessageInfo
  })
}

function onMouseEnter() {
  showTools.value = true
}

function onMouseLeave() {
  showTools.value = false
}

function onReload() {
  getAnswer(messageInfo.value.id)
}

function onDeleteConfirm() {
  openDeleteConfirmDialog.value = true
}

async function onDelete() {
  const deleteResult = await messageController.deleteMessageByIdAsync(messageInfo.value.id)
  if (deleteResult)
    events('onReloadMessageList')
}

function openEditDialog() {
  openEditMessageDialog.value = true
}

async function onSubmitEditMessage() {
  const message = messageContent.value.trim()
  if (message.length === 0) {
    push.error(t('message_cannot_empty'))
    return
  }

  const newInfo: TBMessageInfo = {
    id: messageInfo.value.id,
    conversation_id: messageInfo.value.conversation_id,
    token_id: messageInfo.value.token_id,
    user_content: message,
    gpt_content: '',
    create_time: messageInfo.value.create_time,
    status: 'waiting',
    tool_call: {
      function_name: messageInfo.value.tool_call?.function_name ?? '',
      function_description: messageInfo.value.tool_call?.function_description ?? '',
    },
    vision_file: messageInfo.value.vision_file,
  }

  const updateResult = await messageController.updateMessageInfoAsync(newInfo)

  if (updateResult) {
    push.success(t('editMessage.success'))
    messageInfo.value.user_content = message
    onReload()
  }
  else { push.success(t('editMessage.failed')) }

  openEditMessageDialog.value = false
}

function onExportConversation() {
  if (!messageRef.value) {
    push.error(t('export-failed'))
    return
  }

  html2canvas(messageRef.value!, {
    allowTaint: true,
  }).then((canvas: HTMLCanvasElement) => {
    const downloadLink = document.createElement('a')
    downloadLink.href = canvas.toDataURL()
    downloadLink.download = uid(32)
    downloadLink.click()
  })
}

/**
 * 阅读聊天内容
 */
function onSpeechUserMessageContent() {
  speeching.value = true
  useMessageSpeechStore().playMessage(messageContent.value ?? '', status =>
    speeching.value = !(status === 'finished'),
  )
}

function onSpeechGPTMessageContent() {
  useMessageSpeechStore().playMessage(gptContent.value ?? '', status => gptMessageSpeechStatus.value = status)
}

function scrollBody() {
  props.scrollBody()
}
</script>

<template>
  <div ref="messageRef">
    <div
      class="record-item bg-base border-base flex flex-row gap-16px relative" b="0 b-1 solid"
      @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"
    >
      <div class="avatar w-4 h-4 m-2 b-rd-90 b-rd-1 bg-gray shadow-xl flex-shrink-0" />
      <Markdown :content="messageInfo.user_content" />

      <EditMessageRecordTools
        :speeching="speeching" :show="showTools" class="top-2 right-2 absolute"
        @on-reload="onReload()" @on-delete="onDeleteConfirm()" @on-edit="openEditDialog()"
        @on-export="onExportConversation()" @on-speech="onSpeechUserMessageContent()"
      />
    </div>
    <div class="record-item gpt-item bg-base border-base relative flex flex-row gap-4" b="0 b-1 solid">
      <div class="avatar w-4 h-4 m-2 bg-body shadow-xl b-rd-50% flex-shrink-0" />
      <div class="flex-1 overflow-hidden flex flex-col gap-2">
        <CheckingFunctionCalling v-if="editorStore.thinking && checkingFunctionCalling" />
        <MarkFunctionCallingMessage
          v-if="messageInfo.tool_call !== undefined && !editorStore.thinking"
          :function-description="t(`functionCallingList.${messageInfo.tool_call.function_description}`)"
          :function-name="t(`functionCallingList.${messageInfo.tool_call.function_name}`)"
        />
        <WaitingForFunctionCallingResponse
          v-if="editorStore.thinking && useFunctionCalling && waitingFunctionResult"
          :function-name="useFunctionName" :function-description="useFunctionDescription"
        />

        <div v-if="messageInfo.status !== 'error'">
          <GPTVisionList v-if="messageInfo.vision_file" :message-info="messageInfo" :loading="loadingMessageAnswer" />

          <Markdown
            v-if="editorStore.thinking || (messageInfo.status !== 'stop' && !editorStore.thinking)"
            class="gpt_content" :content="gptContent"
          />
          <div
            v-if="!editorStore.thinking && messageInfo.status === 'stop'"
            class="flex flex-row gap-2 line-height-32px h-32px color-fade"
          >
            <div class="i-carbon-information h-20px w-20px m-6px" />
            <div>
              {{ t('messageRecord.message_cancel') }}
            </div>
            <button
              class="outline-none b-1 border-base border-dashed b-rd px-4 hover-bg-base bg-body transition-all color-base"
              @click="onReload"
            >
              {{ t('basic.reload') }}
            </button>
          </div>

          <div class="flex flex-row-reverse gap-2 px-4 select-none">
            <div v-if="messageInfo.vision_file" class="flex flex-row line-height-24px gap-1">
              <div class="color-green m-4px i-carbon-checkmark-filled" />
              <div class="color-fade text-3">
                {{ t('use_gpt_vision_api') }}
              </div>
            </div>

            <div v-if="messageInfo.tool_call" class="flex flex-row h-24px gap-1">
              <div class="color-green m-4px i-carbon-checkmark-filled" />
              <div class="color-fade text-3 line-height-24px">
                {{ t('use_function_calling_tools') }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="b-1 b-rd p-16px border-solid border-red-4 bg-red-1 color-red-7 select-none">
          <div class="font-bold text-5 m-b-1">
            {{ t('messageRecord.message_error') }}
          </div>
          <Markdown :content="messageInfo.gpt_content ?? 'Unknown error'" />
        </div>
      </div>
      <div
        class="icon-button absolute bottom-2 right-2 text-4" :class="[
          gptMessageSpeechStatus === 'finished' ? 'i-carbon-voice-activate'
          : gptMessageSpeechStatus === 'processing' ? 'i-svg-spinners-gooey-balls-1' : 'i-svg-spinners-180-ring',
        ]" @click="onSpeechGPTMessageContent"
      />
    </div>
  </div>

  <Dialog
    :open="openDeleteConfirmDialog" :title="t('dialog_delete_confirm_title')" @on-close="() => {
      openDeleteConfirmDialog = false
    }"
  >
    <div color-red>
      {{ t('session_clear_warning') }}
    </div>

    <div flex flex-row gap-2 m-t-2>
      <div flex-1 />
      <button
        class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
        @click="onDelete()"
      >
        {{ t('delete') }}
      </button>
      <button
        class="bg-body color-base outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2" @click="() => {
          openDeleteConfirmDialog = false
        }"
      >
        {{ t('cancel') }}
      </button>
    </div>
  </Dialog>

  <Dialog
    :open="openEditMessageDialog" :title="t('dialog_edit_title')" @on-close="() => {
      openEditMessageDialog = false
    }"
  >
    <div flex flex-row>
      <textarea
        v-model.trim="messageContent" class="flex-1 border-base outline-none bg-body color-base" b="1 solid rd-1"
        p="x-4 y-2"
      />
    </div>
    <div flex flex-row m-t-4 gap-2>
      <div flex-1 />
      <button
        class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
        @click="onSubmitEditMessage()"
      >
        {{ t('submit') }}
      </button>
      <button
        class="bg-body color-base outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2" @click="() => {
          openEditMessageDialog = false
        }"
      >
        {{ t('cancel') }}
      </button>
    </div>
  </Dialog>
</template>

<style scoped>
.record-item {
  padding: 16px;
  animation: slide-down .3s forwards;
}

.gpt-item>.avatar {
  background: linear-gradient(24deg, #2a2dce 0%, rgba(247, 0, 208, 0.890484) 100%);
}

.gpt-item,
.avatar {
  background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%204096%204096%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22x37ws8lk43i60c%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221%22%20numOctaves%3D%222.8%22%20stitchTiles%3D%22stitch%22%20%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23x37ws8lk43i60c)%22%20opacity%3D%220.1%22%20%2F%3E%3C%2Fsvg%3E');
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
