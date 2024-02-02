import type { ChatCompletionMessage, ChatVisionMessage } from '../type/chat.completion.message'

function handleChatVisionPrecondition(message: string, visionFile: {
  file_name: string
  b64_data: string
}[]): ChatCompletionMessage[] {
  const messageList = [{
    role: 'system',
    content: 'You are a vision assistant and you need to help your users with various vision questions. At the same time you need to follow a few rules: 1. answer every question in as much detail as possible; 2. the content of your answers should be reliable; 3. you should analyze what your users want by context; 4. if the questions are specialized, you should answer them more professionally. 5. don\'t provide any answers that are illegal or against humanitarianism.',
  }] as ChatCompletionMessage[]

  const visionMessageList: ChatVisionMessage[] = []

  visionMessageList.push({
    type: 'text',
    text: message,
  } as ChatVisionMessage)

  for (const item of visionFile) {
    visionMessageList.push({
      type: 'image_url',
      image_url: {
        url: item.b64_data,
      },
    } as ChatVisionMessage)
  }

  messageList.push({
    role: 'user',
    content: visionMessageList,
  })

  return messageList
}

export default handleChatVisionPrecondition
