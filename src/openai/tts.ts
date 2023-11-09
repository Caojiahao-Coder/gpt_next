import type { OpenAIFetchInfo } from './api'

export async function fetchText2Speech(payload: OpenAIFetchInfo) {
  const initOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${payload.apikey}`,
    },
    method: 'POST',
    body: JSON.stringify(payload.body),
  }

  return fetch('https://api.openai.com/v1/audio/speech', initOptions)
}
