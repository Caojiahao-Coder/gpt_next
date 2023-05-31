import type { MessageResultByStreamType } from './message-type'

export async function parserStreamText(response: Response, callback: (content: string) => void) {
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
