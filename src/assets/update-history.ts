const UpdateHistory: {
  status: 'active' | 'inactive'
  code: string
  content: string
  content_cn: string
}[] = [{
  status: 'active',
  code: '3a6b4ec8-8323-4387-a23c-d128afc33436',
  content: `
# Update date: 2024-02-15
# Version: V2.0.0

## 🪄 New features
1. Support for OpenAI to cancel an answer while it is being provided.
2. Support for users to define their own OpenAI API BaseURL.
3. User-defined values for Top P and Temperature are supported.

## 🤖 Optimization functions
1. Support more OpenAI request error messages.
2. Update the ChatGPT model list.
3. New UI system.

## 📉 Removed functions
1. Delete the MockData function.
2. Delete some useless data tables.
  `,
  content_cn: `
# 更新日期:2024-02-15
# 版本:V2.0.0

## 🪄 新功能
1. 支持OpenAI在提供答案时取消答案。
2. 支持用户定义自己的OpenAI API BaseURL。
3. “Top P”和“Temperature”支持自定义值。

## 🤖 优化功能
1. 支持更多的OpenAI请求错误消息。
2. 更新ChatGPT模型列表。
3. 新的UI系统。

## 📉 删除的功能
1. 删除MockData函数。
2. 删除一些无用的数据表。
  `,
}]

export default UpdateHistory
