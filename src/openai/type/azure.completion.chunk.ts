interface ChatCompletionChunk {
  id: string
  object: string
  created: number
  model: string
  system_fingerprint: string
  choices: ChatCompletionChunkChoice[]
}

interface ChatCompletionChunkChoice {
  index: number
  delta: {
    content: string | null
  } | null
  logprobs: null
  finish_reason: null
}

interface ToolCalls {
  index: number
  id: string
  type: string
  function: {
    name: string
    arguments: string
  }
}

export type {
  ChatCompletionChunk,
}
