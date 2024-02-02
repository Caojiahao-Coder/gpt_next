interface OpenAIErrorInfo {
  error: {
    message: string | null
    type: string | null
    param: string | null
    code: string | null
  }
}

export type { OpenAIErrorInfo }
