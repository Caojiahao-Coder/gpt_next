/**
 * 对聊天信息进行引导 使其答案更加准确
 * 处理 聊天对话内容
 */
function handleChatCompletions(messages: { role: string; content: string }[]): { role: string; content: string }[] {
  const language = window.localStorage.getItem('language') ?? 'auto'

  if (language !== 'auto') {
    messages.unshift({
      role: 'user',
      content: `Please answer my questions in ${language}.`,
    })
  }

  const role = window.localStorage.getItem('role') ?? 'auto'
  if (role === 'auto')
    return messages

  switch (role) {
    case 'developer':
      messages.unshift({
        role: 'user',
        content: 'Please answer the following questions from the perspective of a software development engineer.',
      })
      break
    case 'doctor':
      messages.unshift({
        role: 'user',
        content: 'Please answer the following questions from the perspective of a doctor.',
      })
      break
    case 'teacher':
      messages.unshift({
        role: 'user',
        content: 'Please answer the following questions from the perspective of a doctor.',
      })
      break
    case 'student':
      messages.unshift({
        role: 'user',
        content: 'Please answer the following questions from the perspective of a student.',
      })
      break
    case 'leader':
      messages.unshift({
        role: 'user',
        content: 'Please answer the following questions from the perspective of a leader.',
      })
      break
    case 'subordinate':
      messages.unshift({
        role: 'user',
        content: 'Please answer the following questions from the perspective of a subordinate.',
      })
      break
  }
  return messages
}

function handleCreateSessionNameByGPT(messages: { role: string; content: string }[]) {
  messages.push({
    role: 'user',
    content: 'Summarize a short and relevant title of input with no more than 5 words. (Use the language of the current conversation)',
  })

  return messages
}

export {
  handleChatCompletions,
  handleCreateSessionNameByGPT,
}
