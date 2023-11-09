import axios from 'axios'
import type { OpenAIFetchInfo } from './api'

export async function fetchGenerateImages(payload: OpenAIFetchInfo) {
  const initOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${payload.apikey}`,
    },
    method: 'POST',
    body: JSON.stringify(payload.body),
  }

  return fetch('https://api.openai.com/v1/images/generations', initOptions)
}

export async function downloadImgByURL(url: string) {
  axios({
    method: 'GET',
    url,
    responseType: 'stream',
  }).then((res) => {
    console.log(res.data)
  })
}
