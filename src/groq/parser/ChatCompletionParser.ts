import type { ChatCompletionChunk } from '../../openai/type/chat.completion.chunk'

export default async function ChatCompletionParserByGroq(response: Response, callback: (text: string) => void): Promise<boolean> {
  const reader = response.body?.getReader()

  if (!reader)
    return false

  if (response.status === 400) {
    const text = await response.text()
    console.error(text)
    return false
  }

  let isDone = false

  while (!isDone) {
    const { done, value } = await reader!.read()

    const text = new TextDecoder('utf-8').decode(value)

    const arr = text.split('\n')

    arr.forEach((a) => {
      if (a.length === 0 || a.startsWith(':') || a.startsWith('data: [DONE]'))
        return

      const myData = parserStreamText(a.trim())

      if (!myData)
        return

      isDone = a.startsWith('data: [DONE]') || myData.choices[0].finish_reason === 'stop'

      const value = myData.choices[0].delta?.content ?? ''
      if (value && value.length > 0)
        callback(value)
    })

    isDone = isDone || done
  }

  return true
}

function parserStreamText(text: string): ChatCompletionChunk | null {
  try {
    if (text.startsWith('data: '))
      text = text.substring(6)

    if (text.startsWith('{'))
      text = text.trim()

    const data = JSON.parse(text) as ChatCompletionChunk
    return data
  }
  catch {
    return null
  }
}
