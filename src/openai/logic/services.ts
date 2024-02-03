import type { OpenAIErrorInfo } from '../type/openai.error'
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
    }
  }

  /**
   * 创建聊天对话
   * @param message
   * @param useVisionAPI
   * @param useTools
   * @returns
   */
  public async createChatCompletionsRequest(message: ChatCompletionMessage[], useVisionAPI: boolean): Promise<OpenAIRequestResult> {
    const openAIPayload = await this.getOpenAIPayload()

    if (!openAIPayload) {
      return Promise.resolve({
        code: -1,
        data: null,
        message: 'Can\'t get OpenAI payload; Please check your API key and model settings.',
      })
    }

    try {
      const signal = this.controller.signal

      const usedModel = useVisionAPI ? 'gpt-4-vision-preview' : openAIPayload?.model

      const tools = useVisionAPI ? null : chatFunctionCallingController.getTools()

      let fetchBody = null

      if (tools && tools.length > 0) {
        fetchBody = JSON.stringify({
          top_p: topP.value,
          max_tokens: useVisionAPI ? gpt_models.find(item => item.value === usedModel)?.tokens : null,
          temperature: temperature.value,
          stream: true,
          model: usedModel,
          messages: message,
          tools,
        })
      }
      else {
        fetchBody = JSON.stringify({
          top_p: topP.value,
          max_tokens: useVisionAPI ? gpt_models.find(item => item.value === usedModel)?.tokens : null,
          temperature: temperature.value,
          stream: true,
          model: usedModel,
          messages: message,
        })
      }

      const fetchPayload = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIPayload?.apikey}`,
        },
        method: 'POST',
        body: fetchBody,
        signal,
      }

      const url = `${this.BASE_URL}chat/completions`

      return new Promise<OpenAIRequestResult>((resolve) => {
        fetch(url, fetchPayload)
          .then(async (response) => {
            if (response.status !== 200) {
              const errorJson = await response.text()
              const errorData = JSON.parse(errorJson) as OpenAIErrorInfo
              resolve({
                code: -1,
                data: null,
                message: errorData.error.message || 'Unknown error',
              })
            }
            else {
              resolve({
                code: 1,
                data: response,
                message: '',
              })
            }
          })
          .catch((e: any) => {
            resolve({
              code: -1,
              data: null,
              message: 'Unknown error',
            })
          })
      })
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

  public async createImagesGenerationsRequest(message: string, imageStyle: string): Promise<OpenAIRequestResult> {
    const openAIPayload = await this.getOpenAIPayload()

    if (!openAIPayload) {
      return Promise.resolve({
        code: -1,
        data: null,
        message: 'Can\'t get OpenAI payload; Please check your API key and model settings.',
      })
    }

    try {
      const signal = this.controller.signal

      const fetchPayload = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIPayload?.apikey}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: message,
          n: 1,
          quality: 'hd',
          style: imageStyle,
          size: '1024x1024',
          response_format: 'b64_json',
        }),
        signal,
      }

      const url = `${this.BASE_URL}images/generations`

      return new Promise<OpenAIRequestResult>((resolve) => {
        fetch(url, fetchPayload)
          .then(async (response) => {
            if (response.status !== 200) {
              const errorJson = await response.text()
              const errorData = JSON.parse(errorJson) as OpenAIErrorInfo
              resolve({
                code: -1,
                data: null,
                message: errorData.error.message || 'Unknown error',
              })
            }
            else {
              resolve({
                code: 1,
                data: response,
                message: '',
              })
            }
          })
          .catch((e: any) => {
            resolve({
              code: -1,
              data: null,
              message: 'Unknown error',
            })
          })
      })
    }
    catch (e: any) {
      return {
        code: -1,
        data: null,
        message: e.message,
      }
    }
  }
}

// single instance
const openAIServices = new OpenAIServices()
export default openAIServices
