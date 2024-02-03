import type { MessageResultByStreamType, ToolCallInfo } from './openai-type'

/**
 * 将Stream转换成text
 * @param response
 * @param callback
 * @param errorCallback
 * @returns
 */
export async function parserStreamText(response: Response, callback: (content: string) => void, errorCallback: (data: {
  error: {
    message: string
    type: string
    param: string
    code: string
  }
}) => void): Promise<ToolCallInfo | undefined> {
  if (response.status !== 200 && response.status !== 204) {
    const result: {
      error: {
        message: string
        type: string
        param: string
        code: string
      }
    } = await response.json()
    errorCallback(result)
    return
  }

  const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
  if (!reader)
    return

  const function_calling_info: ToolCallInfo = {
    index: 0,
    id: '',
    type: '',
    function: {
      name: '',
      arguments: '',
    },
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done)
      break
    let dataDone = false
    const arr = value.split('\n')
    arr.forEach((data) => {
      try {
        if (data.length === 0)
          return
        if (data.startsWith(':'))
          return
        if (data === 'data: [DONE]') {
          dataDone = true
          return
        }
        const json = JSON.parse(data.substring(6)) as MessageResultByStreamType
        if (json.choices) {
          const messageItem = json.choices[0].delta.content
          if (messageItem)
            callback(messageItem)

          if (json.choices[0].delta.tool_calls && json.choices[0].delta.tool_calls.length > 0) {
            const toolsCall = json.choices[0].delta.tool_calls[0] as ToolCallInfo
            if (toolsCall.id)
              function_calling_info.id = function_calling_info.id + toolsCall.id.replace(function_calling_info.id, '')
            if (toolsCall.index)
              function_calling_info.index = Number(function_calling_info.index.toString() + toolsCall.index.toString().replace(function_calling_info.index.toString(), ''))
            if (toolsCall.type)
              function_calling_info.type = function_calling_info.type + toolsCall.type.replace(function_calling_info.type, '')
            if (toolsCall.function.name)
              function_calling_info.function.name = function_calling_info.function.name + toolsCall.function.name.replace(function_calling_info.function.name, '')
            if (toolsCall.function.arguments)
              function_calling_info.function.arguments = (function_calling_info.function.arguments + toolsCall.function.arguments.replace(function_calling_info.function.arguments, ''))
          }
        }
      }
      catch {
        // ignore
      }
    })
    if (dataDone)
      break
  }
  return function_calling_info.id.length === 0 ? undefined : function_calling_info
}
