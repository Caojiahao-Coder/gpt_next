import type { OpenAIErrorInfo } from '../../openai/type/openai.error'
import type { ChatCompletionMessage } from '@/openai/type/chat.completion.message'
import type { OpenAIPayloadInfo } from '@/openai/type/openai.payload'
import type { OpenAIRequestResult } from '@/openai/type/openai.response.result'
import { groqApiKey, groqBaseURL, groqModel, temperature, topP } from '@/store/localstorage'

class GroqServices {
  private controller = new AbortController()

  private async getOpenAIPayload(): Promise<OpenAIPayloadInfo | null> {
    return {
      apikey: groqApiKey.value,
      model: groqModel.value,
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
  public async createChatCompletionsRequest(message: ChatCompletionMessage[]): Promise<OpenAIRequestResult> {
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
          'Accept': '*/*',
          'Origin': 'https://groq.com',
        },
        method: 'POST',
        body: JSON.stringify({
          top_p: topP.value,
          temperature: temperature.value,
          max_tokens: 32768,
          stream: true,
          model: groqModel.value,
          messages: message,
        }),
        signal,
      }

      const url = `${groqBaseURL.value}chat/completions`

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
const groqServices = new GroqServices()
export default groqServices
