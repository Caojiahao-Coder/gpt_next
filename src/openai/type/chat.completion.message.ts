import type { ToolCallsInfo } from './chat.completion.tool.calls'

interface ChatCompletionMessage {
  content: string | ChatVisionMessage[] | null
  role: 'user' | 'assistant' | 'tool' | 'system'
  tool_calls: ToolCallsInfo[] | null
  tool_call_id: string | null
  name: string | null
}

interface ChatVisionMessage {
  type: 'text' | 'image_url'
  text: string | null
  image_url: {
    url: string
  } | null
}

export type {
  ChatCompletionMessage,
  ChatVisionMessage,
}
