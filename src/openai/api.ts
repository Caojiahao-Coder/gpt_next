export interface OpenAIFetchInfo {
  apikey: string
  body: Record<string, any>
}

/**
 * 创建OpenAI请求对象
 * @param payload
 * @returns
 */
export async function fetchChatCompletion(payload: OpenAIFetchInfo) {
  const initOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${payload.apikey}`,
    },
    method: 'POST',
    body: JSON.stringify(payload.body),
  }
  return fetch('https://api.openai.com/v1/chat/completions', initOptions)
}
