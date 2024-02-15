interface ToolCallsInfo {
  index: number
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export type {
  ToolCallsInfo,
}
