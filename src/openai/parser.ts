import type { MessageResultByStreamType } from './message-type'
import { useErrorDialogStore } from '@/store/errorDialog'

export async function parserStreamText(response: Response, callback: (content: string) => void, errorCallback: (data: { error: {
  message: string
  type: string
  param: string
  code: string
} }) => void) {
  if (response.status !== 200 && response.status !== 204) {
    const result: { error: {
      message: string
      type: string
      param: string
      code: string
    } } = await response.json()
    const errorDialog = useErrorDialogStore()
    errorDialog.showErrorDialog = true
    errorDialog.message = result.error.message.length === 0 ? result.error.code : result.error.code
    errorCallback(result)
    return
  }

  const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
  if (!reader)
    return

  while (true) {
    const { value, done } = await reader.read()
    if (done)
      break
    let dataDone = false
    const arr = value.split('\n')
    arr.forEach((data) => {
      if (data.length === 0)
        return
      if (data.startsWith(':'))
        return
      if (data === 'data: [DONE]') {
        dataDone = true
        return
      }
      const json = JSON.parse(data.substring(6)) as MessageResultByStreamType
      const messageItem = json.choices[0].delta.content
      if (messageItem)
        callback(messageItem)
    })
    if (dataDone)
      break
  }
}
