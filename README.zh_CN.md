![GPTNext](./images/gpt_next.svg)

[![English badge](https://img.shields.io/badge/%E8%8B%B1%E6%96%87-English-blue)](./README.md)
[![简体中文 badge](https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-Simplified%20Chinese-blue)](./README.zh_CN.md)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next?ref=badge_shield&issueType=license)

# GPT Next

> GPT Next是一个AI聊天工具，可以使用户与AI进行对话。该应用程序使用Vue.js作为前端框架，并利用IndexedDB作为数据库，以保证会话的隐私和安全性。

[🧭在线体验](https://gpt-next-shvd.vercel.app/)

## <svg xmlns="http://www.w3.org/2000/svg" width="42.67" height="16" viewBox="0 0 640 480"><defs><path id="flagCn4x30" fill="#ff0" d="M-.6.8L0-1L.6.8L-1-.3h2z"/></defs><path fill="#ee1c25" d="M0 0h640v480H0z"/><use width="30" height="20" href="#flagCn4x30" transform="matrix(71.9991 0 0 72 120 120)"/><use width="30" height="20" href="#flagCn4x30" transform="matrix(-12.33562 -20.5871 20.58684 -12.33577 240.3 48)"/><use width="30" height="20" href="#flagCn4x30" transform="matrix(-3.38573 -23.75998 23.75968 -3.38578 288 95.8)"/><use width="30" height="20" href="#flagCn4x30" transform="matrix(6.5991 -23.0749 23.0746 6.59919 288 168)"/><use width="30" height="20" href="#flagCn4x30" transform="matrix(14.9991 -18.73557 18.73533 14.99929 240 216)"/></svg>地区使用说明
### 说明
不建议使用频繁更换地区的🪜去直接访问API，这会增加封号的几率，推荐使用境外服务器代理OpenAI来使用。
### 免代理API接口：
- OpenAI API: *https://openai.gptnext.chat/v1/*
- Groq API: *https://groq.gptnext.chat/openai/v1/*

## 特色功能截图 📷
| 绘图模式                               | Function Calling                            |
| -------------------------------------- | ------------------------------------------- |
| ![GPTNext](https://leocaomecover.blob.core.windows.net/projectcover/DrawImageMode.gif) | ![GPTNext](https://leocaomecover.blob.core.windows.net/projectcover/Function_Calling.gif)   |

| 文本转语音                             | 多媒体输入框                                |
| -------------------------------------- | ------------------------------------------- |
| ![GPTNext](https://leocaomecover.blob.core.windows.net/projectcover/Speech.gif)        | ![GPTNext](https://leocaomecover.blob.core.windows.net/projectcover/MultimediaInputBox.gif) |

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
