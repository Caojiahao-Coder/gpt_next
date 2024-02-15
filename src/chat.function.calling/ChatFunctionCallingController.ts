import type { FunctionInfo } from '../openai/type/chat.completion.function.calling'
import _data from './data.tools.json'
import _preceondition from './precondition.tools.json'
import type { ChatCompletionMessage } from '@/openai/type/chat.completion.message'

interface MyFunctionPreconditionInfo {
  functionName: string
  precondition: ChatCompletionMessage
}

class ChatFunctionCallingController {
  getTools(): FunctionInfo[] {
    return _data as FunctionInfo[]
  }

  getPreconditionByFunctionName(functionName: string): ChatCompletionMessage | null {
    const myPrecondition = (_preceondition as MyFunctionPreconditionInfo[]).find(item => item.functionName === functionName)

    if (myPrecondition)
      return myPrecondition.precondition
    else
      return null
  }
}

const chatFunctionCallingController = new ChatFunctionCallingController()

export default chatFunctionCallingController
