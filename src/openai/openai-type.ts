export interface MessageResultType {
  created: number
  id: string
  model: string
  object: string
  choices: ChoicesResultInfo[]
}

export interface ChoicesResultInfo {
  finish_reason: string
  index: number
  message: {
    content: string | any[]
    role: string
  }
}

export interface ToolCallInfo {
  index: number
  id: string
  type: string
  function: {
    name: string
    arguments: string
  }
}

export interface MessageResultByStreamType {
  id: string
  object: string
  created: number
  model: string
  choices: {
    delta: {
      role: string
      content: string
      tool_calls: ToolCallInfo[] | undefined
    }
    index: number
    finish_reason: string | undefined
  }[]
}
