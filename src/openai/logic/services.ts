import type { OpenAIErrorInfo } from '../type/openai.error'
import { gpt_models } from '@/assets/models-list'
import chatFunctionCallingController from '@/chat.function.calling/ChatFunctionCallingController'
import type { ChatCompletionMessage } from '@/openai/type/chat.completion.message'
import type { OpenAIPayloadInfo } from '@/openai/type/openai.payload'
import type { OpenAIRequestResult } from '@/openai/type/openai.response.result'
import { apiKey, baseURL, gptModel, temperature, topP } from '@/store/localstorage'

class OpenAIServices {
  private controller = new AbortController()

  private async getOpenAIPayload(): Promise<OpenAIPayloadInfo | null> {
    return {
      apikey: apiKey.value,
      model: gptModel.value,
    } as OpenAIPayloadInfo
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
  public async createChatCompletionsRequest(message: ChatCompletionMessage[], useVisionAPI: boolean, autoUseTools: boolean = true): Promise<OpenAIRequestResult> {
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

      if (tools && tools.length > 0 && autoUseTools) {
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

      const url = `${baseURL.value}chat/completions`

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
          .catch(() => {
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

      const url = `${baseURL.value}audio/speech`

      return fetch(url, fetchPayload)
    }
    catch (e: any) {
      return null
    }
  }

  /**
   * 创建生成图片请求
   * @param message
   * @param imageStyle
   * @returns
   */
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

      const url = `${baseURL.value}images/generations`

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
          .catch(() => {
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
