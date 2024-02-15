const gpt_models: {
  value: string
  name: string
  tokens: number
}[] = [
  {
    value: 'gpt-4',
    name: 'gpt-4',
    tokens: 8192,
  },
  {
    value: 'gpt-4-0613',
    name: 'gpt-4-0613',
    tokens: 8192,
  },
  {
    value: 'gpt-4-1106-preview',
    name: 'gpt-4-1106(preview)',
    tokens: 128000,
  },
  {
    value: 'gpt-4-vision-preview',
    name: 'gpt-4-vision(preview)',
    tokens: 4096,

  },
  {
    value: 'gpt-3.5-turbo',
    name: 'gpt-3.5-turbo',
    tokens: 4096,
  },
  {
    value: 'gpt-3.5-turbo-1106',
    name: 'gpt-3.5-turbo-1106',
    tokens: 16385,
  },
  {
    value: 'gpt-3.5-turbo-instruct',
    name: 'gpt-3.5-turbo-instruct',
    tokens: 4096,
  },
]

export default gpt_models
