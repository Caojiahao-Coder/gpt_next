import gpt_models from '@/assets/models-list'
import chatFunctionCallingController from '@/chat.function.calling/ChatFunctionCallingController'
import type { ChatCompletionMessage } from '@/openai/type/chat.completion.message'
import type { OpenAIPayloadInfo } from '@/openai/type/openai.payload'
import type { OpenAIRequestResult } from '@/openai/type/openai.response.result'
import useGlobalStore from '@/store/global-store'
import { temperature, topP } from '@/store/localstorage'

class OpenAIServices {
  private readonly BASE_URL = 'https://api.openai.com/v1/'

  private controller = new AbortController()

  private async getOpenAIPayload(): Promise<OpenAIPayloadInfo | null> {
    const globalStore = useGlobalStore()
    const info = await globalStore.getGlobalSetting()
    if (info) {
      return {
        apikey: info.api_key,
        model: info.chat_model,
      } as OpenAIPayloadInfo
    }
    return null
  }

  public cancelRequest() {
    try {
      if (this.controller.signal.aborted)
        return
      this.controller.abort()
      this.controller = new AbortController()
    }
    catch (e: any) {
      console.warn(e.message)
    }
  }

  /**
   * 创建聊天对话
   * @param message
   * @param useVisionAPI
   * @param useTools
   * @returns
   */
  public async createChatCompletionsRequest(message: ChatCompletionMessage[], useVisionAPI: boolean, useTools = true): Promise<OpenAIRequestResult> {
    const openAIPayload = await this.getOpenAIPayload()

    if (!openAIPayload) {
      return Promise.resolve({
        code: -1,
        data: null,
        message: 'Can\'t get OpenAI payload',
      })
    }

    try {
      const signal = this.controller.signal

      const usedModel = useVisionAPI ? 'gpt-4-vision-preview' : openAIPayload?.model

      const tools = useVisionAPI ? [] : chatFunctionCallingController.getTools()

      const fetchPayload = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIPayload?.apikey}`,
        },
        method: 'POST',
        body: JSON.stringify({
          top_p: topP.value,
          max_tokens: useVisionAPI ? gpt_models.find(item => item.value === usedModel)?.tokens : null,
          temperature: temperature.value,
          stream: true,
          model: usedModel,
          messages: message,
          tools: useTools ? tools : null,
        }),
        signal,
      }

      const url = `${this.BASE_URL}chat/completions`

      const response = await fetch(url, fetchPayload)

      return {
        code: 1,
        data: response,
        message: '',
      }
    }
    catch (e: any) {
      return {
        code: -1,
        data: null,
        message: e.message,
      }
    }
  }

  /**
   * 创建语音合成
   * @param message
   * @param voice
   * @param model
   */
  public async createAudioSpeechRequest(message: string, voice: string, model: string): Promise<Response | null> {
    const openAIPayload = await this.getOpenAIPayload()

    if (!openAIPayload)
      return null

    try {
      const signal = this.controller.signal

      const fetchPayload = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIPayload?.apikey}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model,
          input: message,
          voice,
        }),
        signal,
      }

      const url = `${this.BASE_URL}audio/speech`

      return fetch(url, fetchPayload)
    }
    catch (e: any) {
      return null
    }
  }
}

// single instance
const openAIServices = new OpenAIServices()
export default openAIServices
