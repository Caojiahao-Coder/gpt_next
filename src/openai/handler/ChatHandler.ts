import promptController from '@/chat.prompt/PromptController'
import type { TBPromptInfo } from '@/database/table-type'
import type { ChatCompletionMessage } from '@/openai/type/chat.completion.message'

/**
 * 处理条件对话的前置条件
 */
async function handleChatCompletionPrecondition(promptInfo: TBPromptInfo | null): Promise<ChatCompletionMessage[]> {
  const messageList: ChatCompletionMessage[] = []

  if (!promptInfo) {
    /**
   * 设置前置条件
   */
    messageList.push({
      role: 'system',
      content: `
              Now, you are a Q&A assistant and you need to help your users with various questions. At the same time you need to follow a few rules:
              1. answer every question in as much detail as possible;
              2. the content of your answers should be reliable;
              3. you should analyze what your users want by context;
              4. if the questions are specialized, you should answer them more professionally.
              5. don't provide any answers that are illegal or against humanitarianism.
    `,
    })
  }
  else {
    const promptDetailList = await getPromptDetailList(promptInfo.id)
    promptDetailList.map(item => messageList.push(item))
  }

  return messageList
}

/**
 * 获取对话的引导条件
 * @returns
 */
async function getPromptDetailList(promptId: number): Promise<ChatCompletionMessage[]> {
  const promptDetail = await promptController.getPromptDetailByIdAsync(promptId)

  return promptDetail.map((item) => {
    return {
      role: item.role,
      content: item.content,
    }
  })
}

export {
  handleChatCompletionPrecondition,
}
