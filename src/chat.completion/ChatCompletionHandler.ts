import { uid } from 'uid'
import messageController from './MessageController'
import conversationController from './ConversationController'
import type { NewMessageInfo, TBConverstationInfo, TBMessageInfo, TBPromptInfo } from '@/database/table-type'
import type { ChatCompletionMessage } from '@/openai/type/chat.completion.message'
import openAIServices from '@/openai/logic/services'
import { handleChatCompletionPrecondition } from '@/openai/handler/ChatHandler'
import ChatCompletionParser from '@/openai/parser/ChatCompletionParser'
import useEditorStore from '@/store/editor-store'
import handleChatVisionPrecondition from '@/openai/handler/VisionHandler'
import type { ToolCallsInfo } from '@/openai/type/chat.completion.tool.calls'
import chatFunctionCallingController from '@/chat.function.calling/ChatFunctionCallingController'

/**
 * 当前的对话处理器
 */
class ChatCompletionHandler {
  private conversationInfo: TBConverstationInfo

  private promptInfo: TBPromptInfo | null = null

  private lastMessageId = -1

  private editorStore = useEditorStore()

  constructor(conversationInfo: TBConverstationInfo, promptInfo: TBPromptInfo | null) {
    this.conversationInfo = conversationInfo
    this.promptInfo = promptInfo
  }

  getConversationInfo() {
    return this.conversationInfo
  }

  setPromptInfo(promptInfo: TBPromptInfo | null) {
    this.promptInfo = promptInfo
  }

  getPromptInfo(): TBPromptInfo | null {
    return this.promptInfo
  }

  /**
   * 发送一条新的信息
   * @param message
   * @returns
   */
  async sendMessageAsync(message: ChatCompletionMessage, visionFileList: {
    fileName: string
    b64Data: string
  }[] | null = null): Promise<number> {
    try {
      const newMessageInfo = {
        conversation_id: this.conversationInfo.id,
        user_content: message.content,
        gpt_content: '',
        token_id: uid(),
        create_time: Date.now(),
        status: 'waiting',
      } as NewMessageInfo

      if (visionFileList) {
        newMessageInfo.vision_file = JSON.stringify(visionFileList.map((item) => {
          return {
            file_name: item.fileName,
            b64_data: item.b64Data,
          }
        }))
      }

      const messageInfo = await messageController.addNewMessageAsync(newMessageInfo)

      return messageInfo.id
    }
    catch {
      return -1
    }
  }

  /**
   * 获取某个对话的结果
   * @param messageId
   * @param resultCallback
   * @returns
   */
  async getMessageAnswerAsync(messageId: number, resultCallback: (value: string) => void, functionCallingResultCallback: (
    tool_call_id: string,
    functionName: string,
    args: string,
    isDone: boolean
  ) => void): Promise<boolean> {
    this.editorStore.thinking = true

    this.lastMessageId = messageId

    const messageInfo = await messageController.getMessageInfoByIdAsync(messageId)

    const useVisionAPI = messageInfo.vision_file !== undefined

    const messageList = await this.generateMessageListByMessageInfoAsync(messageInfo)

    // 得到请求包
    const chatCompletionResponse = await openAIServices.createChatCompletionsRequest(messageList, useVisionAPI)

    if (chatCompletionResponse.code !== 1) {
      this.editorStore.thinking = false
      await this.markMessageErrorAsync(messageInfo, chatCompletionResponse.message)
      return false
    }

    let parserResult = false

    let markResult = false

    let needFunctionResult = false

    if (chatCompletionResponse.data !== null) {
      let gptContent = ''

      parserResult = await ChatCompletionParser(chatCompletionResponse.data!, (text) => {
        gptContent += text
        resultCallback(text)
      }, (tool_call_id, fname, args, isDone) => {
        needFunctionResult = true
        functionCallingResultCallback(tool_call_id, fname, args, isDone)
      })

      if (parserResult)
        markResult = await this.markMessageCompletedAsync(messageInfo, gptContent)
    }

    if (!needFunctionResult)
      this.editorStore.thinking = false
    return (parserResult && markResult)
  }

  async getDataWorkAnswerAsync(messageId: number, messageList: ChatCompletionMessage[], resultCallback: (value: string) => void) {
    this.editorStore.thinking = true

    this.lastMessageId = messageId

    // 得到请求包
    const chatCompletionResponse = await openAIServices.createDataWorkRequest(messageList)

    const messageInfo = await messageController.getMessageInfoByIdAsync(messageId)

    if (chatCompletionResponse.code !== 1) {
      this.editorStore.thinking = false
      await this.markMessageErrorAsync(messageInfo, chatCompletionResponse.message)
      return false
    }

    let parserResult = false

    let markResult = false

    let needFunctionResult = false

    if (chatCompletionResponse.data !== null) {
      let gptContent = ''

      parserResult = await ChatCompletionParser(chatCompletionResponse.data!, (text) => {
        gptContent += text
        resultCallback(text)
      }, () => {
        needFunctionResult = true
      })

      if (parserResult)
        markResult = await this.markMessageCompletedAsync(messageInfo, gptContent)
    }

    if (!needFunctionResult)
      this.editorStore.thinking = false
    return (parserResult && markResult)
  }

  /**
   * 通过messageId获取对话标题
   * @param messageId
   * @returns
   */
  async getChatCompletionTitleFromMessageAsync(messageId: number) {
    const messageInfo = await messageController.getMessageInfoByIdAsync(messageId)

    const messages: ChatCompletionMessage[] = [{
      role: 'system',
      content: 'You are a conversation summary assistant, you will generate a short title (10 characters or less) based on the user\'s conversation with you.',
      tool_call_id: null,
      tool_calls: null,
      name: null,
    }, {
      role: 'user',
      content: `The question for the dialogue is: ${messageInfo.user_content}`,
      tool_call_id: null,
      tool_calls: null,
      name: null,
    }]

    const chatCompletionResponse = await openAIServices.createChatCompletionsRequest(messages, false)

    if (chatCompletionResponse.code !== 1 || chatCompletionResponse.data === null)
      return

    let title = ''

    await ChatCompletionParser(chatCompletionResponse.data!, (text) => {
      title += text
    }, () => { })

    this.updateConversationTitleByIdAsync(title, messageInfo.conversation_id)
  }

  /**
   * 通过ConversationId更新对话标题
   * @param title
   * @param conversationId
   * @returns
   */
  async updateConversationTitleByIdAsync(title: string, conversationId: number) {
    const conversationInfo = await conversationController.getConversationInfoByIdAsync(conversationId)

    if (conversationInfo === null)
      return

    const newInfo = {
      id: conversationInfo.id,
      title,
      description: conversationInfo.description,
      color: conversationInfo.color,
      create_time: conversationInfo.create_time,
      conversation_token: conversationInfo.conversation_token,
      fixed_top: conversationInfo.fixed_top,
      type: conversationInfo.type,
    } as TBConverstationInfo

    conversationController.updateConversationInfoAsync(newInfo)
  }

  /**
   * 标记某个对话请求已经完成
   * @param messageInfo
   * @param gptContent
   * @returns
   */
  async markMessageCompletedAsync(messageInfo: TBMessageInfo, gptContent: string, tool_call: {
    function_name: string
    function_description: string
  } | null = null): Promise<boolean> {
    const newInfo = {
      id: messageInfo.id,
      conversation_id: messageInfo.conversation_id,
      user_content: messageInfo.user_content,
      gpt_content: gptContent,
      create_time: messageInfo.create_time,
      token_id: messageInfo.token_id,
      status: 'finished',
      tool_call: tool_call === null ? messageInfo.tool_call : tool_call,
      vision_file: messageInfo.vision_file,
    } as TBMessageInfo
    const result = await messageController.updateMessageInfoAsync(newInfo)
    return result
  }

  /**
   * 标记某个对话请求出现错误
   * @param messageInfo
   * @param errorMessage
   * @returns
   */
  async markMessageErrorAsync(messageInfo: TBMessageInfo, errorMessage: string): Promise<boolean> {
    const newInfo = {
      id: messageInfo.id,
      conversation_id: messageInfo.conversation_id,
      user_content: messageInfo.user_content,
      gpt_content: errorMessage,
      create_time: messageInfo.create_time,
      token_id: messageInfo.token_id,
      status: 'error',
      tool_call: messageInfo.tool_call,
      vision_file: messageInfo.vision_file,
    } as TBMessageInfo
    const result = await messageController.updateMessageInfoAsync(newInfo)
    return result
  }

  /**
   * 停止某个对话请求
   * @param messageId
  */
  async stopMessageAnswerAsync(gptContent = '') {
    if (this.lastMessageId === -1)
      return

    openAIServices.cancelRequest()

    const messageInfo = await messageController.getMessageInfoByIdAsync(this.lastMessageId)

    const newInfo = {
      id: messageInfo.id,
      conversation_id: messageInfo.conversation_id,
      user_content: messageInfo.user_content,
      gpt_content: gptContent,
      create_time: messageInfo.create_time,
      token_id: messageInfo.token_id,
      status: 'stop',
      tool_call: messageInfo.tool_call,
      vision_file: messageInfo.vision_file,
    } as TBMessageInfo

    await messageController.updateMessageInfoAsync(newInfo)

    this.editorStore.thinking = false
  }

  /**
   * 获取当前对话的所有Message列表
   */
  async getMessageListAsync(): Promise<TBMessageInfo[]> {
    return await messageController.getMessageByConversationIdAsync(this.conversationInfo.id)
  }

  /**
   * 通过回调函数结果生成对话结果
   * @param messageId
   * @param tool_call_id
   * @param functionName
   * @param functionDescription
   * @param functionArgs
   * @param functionResult
   * @param resultCallback
   * @returns
   */
  async getMessageAnswerFromFunctionResultAsync(messageId: number, tool_call_id: string, functionName: string, functionDescription: string, functionArgs: string, functionResult: string, resultCallback: (value: string) => void): Promise<boolean> {
    this.editorStore.thinking = true

    const messageInfo = await messageController.getMessageInfoByIdAsync(messageId)

    const messageList = await this.generateMessageListByMessageInfoAsync(messageInfo)

    const functionPrecondition = chatFunctionCallingController.getPreconditionByFunctionName(functionName)

    if (functionPrecondition) {
      messageList.slice(0, 1)
      messageList.unshift(functionPrecondition)
    }

    const useVisionAPI = messageInfo.vision_file !== undefined

    messageList.push({
      role: 'assistant',
      content: null,
      tool_calls: [{
        index: 0,
        id: tool_call_id,
        type: 'function',
        function: {
          name: functionName,
          arguments: functionArgs,
        },
      }] as ToolCallsInfo[],
    } as ChatCompletionMessage)

    messageList.push({
      tool_call_id,
      role: 'tool',
      content: functionResult,
      name: functionName,
    } as ChatCompletionMessage)

    const chatCompletionResponse = await openAIServices.createChatCompletionsRequest(messageList, useVisionAPI)

    if (chatCompletionResponse.code !== 1) {
      this.editorStore.thinking = false
      await this.markMessageErrorAsync(messageInfo, chatCompletionResponse.message)
      return false
    }

    let parserResult = false
    let markResult = false

    if (chatCompletionResponse.data !== null) {
      let gptContent = ''

      parserResult = await ChatCompletionParser(chatCompletionResponse.data!, (text) => {
        gptContent += text
        resultCallback(text)
      }, () => { })

      if (parserResult) {
        markResult = await this.markMessageCompletedAsync(messageInfo, gptContent, {
          function_name: functionName,
          function_description: functionDescription,
        })
      }
    }

    this.editorStore.thinking = false
    return (parserResult && markResult)
  }

  /**
   * 通过对话ID清楚聊天记录
   */
  async clearMessageByConversationIdAsync(): Promise<boolean> {
    return await messageController.clearMessagesByConversationIdAsync(this.conversationInfo.id)
  }

  private async generateMessageListByMessageInfoAsync(messageInfo: TBMessageInfo): Promise<ChatCompletionMessage[]> {
    const message = {
      role: 'user',
      content: messageInfo.user_content,
    } as ChatCompletionMessage

    const messageList = await handleChatCompletionPrecondition(this.promptInfo)

    const messageHistoryList: TBMessageInfo[] = (await messageController.getMessageByConversationIdAsync(messageInfo.conversation_id)).filter(a => a.status === 'finished')
    const historyMessage: ChatCompletionMessage[] = []
    for (let i = 0; i < messageHistoryList.length; i++) {
      const item = messageHistoryList[i]
      historyMessage.push({
        content: item.user_content,
        role: 'user',
      } as ChatCompletionMessage)

      historyMessage.push({
        content: item.gpt_content,
        role: 'assistant',
      } as ChatCompletionMessage)
    }

    messageList.push(...historyMessage)

    if (messageInfo.vision_file) {
      const visionMessageList = handleChatVisionPrecondition(messageInfo.user_content, JSON.parse(messageInfo.vision_file!) as {
        file_name: string
        b64_data: string
      }[])

      messageList.push(...visionMessageList)
    }
    else {
      messageList.push(message)
    }

    return messageList
  }
}

export default ChatCompletionHandler
