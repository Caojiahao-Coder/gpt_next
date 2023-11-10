import { language } from '@/store/localstorage'

/**
 * 对聊天信息进行引导 使其答案更加准确
 * 处理 聊天对话内容
 */
function handleChatCompletions(messages: { role: string; content: string }[]): { role: string; content: string }[] {
  if (language.value !== 'auto') {
    messages.unshift({
      role: 'system',
      content: `All answers are in the following language: ${language.value}.`,
    })
  }

  const role = window.localStorage.getItem('role') ?? 'auto'
  if (role === 'auto')
    return messages

  switch (role) {
    case 'developer':
      messages.unshift({
        role: 'system',
        content: 'You are a software development assistant.',
      })
      break
    case 'doctor':
      messages.unshift({
        role: 'system',
        content: 'You are a doctor assistant.',
      })
      break
    case 'teacher':
      messages.unshift({
        role: 'system',
        content: 'You are a teacher assistant.',
      })
      break
    case 'student':
      messages.unshift({
        role: 'system',
        content: 'You are a student assistant.',
      })
      break
    case 'leader':
      messages.unshift({
        role: 'system',
        content: 'You are a leader assistant.',
      })
      break
    case 'subordinate':
      messages.unshift({
        role: 'system',
        content: 'You are a subordinate assistant.',
      })
      break
  }
  return messages
}

function handleCreateSessionNameByGPT(messages: { role: string; content: string }[]) {
  messages.push({
    role: 'system',
    content: 'Summarize a short and relevant title of input with no more than 5 words. (Use the language of the current conversation)',
  })

  return messages
}

export {
  handleChatCompletions,
  handleCreateSessionNameByGPT,
}
