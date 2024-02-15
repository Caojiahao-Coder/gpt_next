interface OpenAIRequestResult {
  code: -1 | 1
  data: Response | null
  message: string
}

export type{
  OpenAIRequestResult,
}
