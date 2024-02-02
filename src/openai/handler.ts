import { language } from '@/store/localstorage'

/**
 * 对聊天信息进行引导 使其答案更加准确
 * 处理 聊天对话内容
 */
async function handleChatCompletions(messages: { role: 'user' | 'assistant' | 'tool' | 'system'; content: string | any[] }[]): Promise<{ role: 'user' | 'assistant' | 'tool' | 'system'; content: string | any[] }[]> {
  messages.unshift({
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
  if (language.value !== 'auto') {
    messages.unshift({
      role: 'user',
      content: `Please answer in ${language.value}.`,
    })
  }

  return messages
}

/**
   * 根据聊天内容创建会话名称
   * @param messages
   * @returns
   */
function handleCreateSessionNameByGPT(messages: { role: 'user' | 'assistant' | 'tool' | 'system'; content: string }[]) {
  messages.push({
    role: 'system',
    content: `
    Now you are a conversation summarization assistant. You generate a short summary to be used as the title of the conversation based on the chat between the conversation bot and the user.
    They will use various languages, but there are three languages for you to answer, Auto, Chinese, and English. if the user uses Auto you choose the language according to the user's language, if they choose Chinese you answer in Chinese, and if they choose English you answer in English.
    Now the user's language is:${language.value}
    `,
  })

  return messages
}

export {
  handleChatCompletions,
  handleCreateSessionNameByGPT,
}
