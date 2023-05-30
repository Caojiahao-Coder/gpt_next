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
    content: string
    role: string
  }
}

export interface MessageResultByStreamType {
  id: string
  object: string
  created: number
  model: string
  choices: {
    delta: { content: string }
    index: number
    finish_reason: string | undefined
  }[]
}
