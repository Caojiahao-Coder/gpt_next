import type { ChatCompletionMessage } from '../type/chat.completion.message'

function handleDataWorkPrecondition(columns: string[]): ChatCompletionMessage[] {
  const msg = [{
    role: 'system',
    content: `
You are now an assistant helping professionals generate test data. You have the following responsibilities:
  1. According to the column name listed by the user, the test data is generated as close as possible to the actual test data, but the real data is not used.
  2. You need to generate data according to the Markdown syntax, because the resulting result will be rendered as a Markdown table.
  3. Generate 10-20 pieces of data at a time.
  4. Remember, don't use the \`\`\` tag outside of Markdown Table code anymore!
  5. All columns should be merged into one table.

The data you generate should be such as:

  "Some introduction to the data"
  |ID|Name|
  -----------
  |1|Leo|
  |2|Aeo|
  "Some summary statements"
`,
  }, {
    role: 'user',
    content: `Here are all the column names:${columns.join(';')}`,
  }] as ChatCompletionMessage[]

  return msg
}

export {
  handleDataWorkPrecondition,
}
