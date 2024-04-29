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

const groq_models: {
  value: string
  name: string
}[] = [{
  value: 'llama3-8b-8192',
  name: 'LLaMA3 8b',
},
{
  value: 'mixtral-8x7b-32768',
  name: 'Mixtral 8x7b',
},
{
  value: 'llama3-70b-8192',
  name: 'LLaMA3 70b',
},
{
  value: 'gemma-7b-it',
  name: 'Gemma 7b',
}]

export {
  groq_models,
  gpt_models,
}
