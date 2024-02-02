interface FunctionInfo {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: any
      required: string[]
    }
  }
}

export type { FunctionInfo }
