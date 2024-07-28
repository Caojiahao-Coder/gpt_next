![GPTNext](./images/gpt_next.svg)

[![English badge](https://img.shields.io/badge/%E8%8B%B1%E6%96%87-English-blue)](./README.md)
[![简体中文 badge](https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-Simplified%20Chinese-blue)](./README.zh_CN.md)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next?ref=badge_shield&issueType=license)

# GPT Next

> GPT Next是一个AI聊天工具，可以使用户与AI进行对话。该应用程序使用Vue.js作为前端框架，并利用IndexedDB作为数据库，以保证会话的隐私和安全性。

[🧭在线体验](https://gpt-next-shvd.vercel.app/)

## 大陆地区使用说明
### 说明
不建议使用频繁更换地区的🪜去直接访问API，这会增加封号的几率，推荐使用境外服务器代理OpenAI来使用。
### 免代理API接口：
> 设置其为GPTNext中的BaseURL就可以实现免代理访问API接口
- OpenAI API: *https://openai.gptnext.chat/v1/*
- Groq API: *https://groq.gptnext.chat/openai/v1/*

## 特色功能截图 📷
| 绘图模式                               | Function Calling                            |
| -------------------------------------- | ----------------------------------------- |
| ![68747470733a2f2f6c656f63616f6d65636f7665722e626c6f622e636f72652e77696e646f77732e6e65742f70726f6a656374636f7665722f44726177496d6167654d6f64652e676966](https://github.com/user-attachments/assets/2a600582-bf6f-42cd-a8bf-28d9a2c1d2f4)| ![68747470733a2f2f6c656f63616f6d65636f7665722e626c6f622e636f72652e77696e646f77732e6e65742f70726f6a656374636f7665722f46756e6374696f6e5f43616c6c696e672e676966](https://github.com/user-attachments/assets/85cecb71-646e-4c31-8123-d88e7ee335d3)|

| 文本转语音                             | 多媒体输入框                                |
| ------------------------------- | ------------------------------------------- |
| ![68747470733a2f2f6c656f63616f6d65636f7665722e626c6f622e636f72652e77696e646f77732e6e65742f70726f6a656374636f7665722f5370656563682e676966](https://github.com/user-attachments/assets/c5038748-b578-41c0-9687-74360fbc64e8)| ![68747470733a2f2f6c656f63616f6d65636f7665722e626c6f622e636f72652e77696e646f77732e6e65742f70726f6a656374636f7665722f4d756c74696d65646961496e707574426f782e676966](https://github.com/user-attachments/assets/7c204ddb-049e-425e-bdc3-a9813b7f58bc)|
## 产品特点 🚀

- ⚔**会话记录保存**：该应用程序使用IndexedDB作为数据库，以保证会话的隐私和安全性。所有会话记录都被保存，以便以后访问。
- 🔗**持久会话模式**：该功能使AI记住对话的上下文，并提供更准确的答案。
- 🤹‍♀️**多个角色**：内置多种聊天角色，使AI的答案更准确。
- 👏**可读性**：利用微软的语音服务，消息可以变得可播放。

## 入门指南 🎯

### 要运行此项目，请按照以下步骤操作：

1. 将此存储库克隆到本地计算机上。
2. 在命令行中运行pnpm install以安装所有必要的依赖项。

### 使用Docker启动应用程序，请按照以下步骤操作：

1. Pull the repository (main branch).
2. Run docker build -t gpt_next:latest .
3. Run docker run -d -p 1003:8080 --name gpt_next --restart=always gpt_next:latest
4. 尽情享受！

### 或者，您可以按照以下步骤使用源代码运行应用程序：

1. Pull the repository (main branch).
2. Run pnpm install.
3. Run pnpm dev.
4. Enjoy!

## 🚧 功能清单

- [x] 会话记录保存
- [x] 持久会话模式
- [x] 多个角色
- [x] 支持图像生成
- [x] 支持编辑对话
- [x] 支持Function Calling调用
- [x] 支持Open AI 视觉API (预览版)
- [x] 支持Open AI 文本转语音API (TTS)

## Bug列表：

## 感谢：

- [anse-app/anse](https://github.com/anse-app/anse)
- [CatsJuice/ipad-cursor](https://github.com/CatsJuice/ipad-cursor)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Caojiahao-Coder/gpt_next&type=Date)](https://star-history.com/#Caojiahao-Coder/gpt_next&Date)

## FOSSA 状态
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next?ref=badge_large&issueType=license)

## 许可证：
MIT © [Leo Cao](https://github.com/Caojiahao-Coder)
