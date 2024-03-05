![GPTNext](./images/gpt_next.svg)

[![English badge](https://img.shields.io/badge/%E8%8B%B1%E6%96%87-English-blue)](./README.md)
[![简体中文 badge](https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-Simplified%20Chinese-blue)](./README.zh_CN.md)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next?ref=badge_shield&issueType=license)

# GPT Next 

> GPT Next is an AI chat tool that enables users to have conversations with an AI. The application is built using Vue.js as the frontend framework and utilizes IndexedDB as the database to guarantee the privacy and security of the session.

[🧭Live preview](https://gpt-next-shvd.vercel.app/)

## 大陆地区使用说明
### 说明
不建议使用频繁更换地区的🪜去直接访问API，这会增加封号的几率，推荐使用境外服务器代理OpenAI来使用。
### 免代理API接口：
> 设置其为GPTNext中的BaseURL就可以实现免代理访问API接口
- OpenAI API: *https://openai.gptnext.chat/v1/*
- Groq API: *https://groq.gptnext.chat/openai/v1/*

## Features Screenshots 📷
| Draw Image Mode                        | Function Calling                          |
| -------------------------------------- | ----------------------------------------- |
| ![GPTNext](https://leocaomecover.blob.core.windows.net/projectcover/DrawImageMode.gif) | ![GPTNext](https://leocaomecover.blob.core.windows.net/projectcover/Function_Calling.gif) |

| Text to Speech                  | Multimedia Input Box                        |
| ------------------------------- | ------------------------------------------- |
| ![GPTNext](https://leocaomecover.blob.core.windows.net/projectcover/Speech.gif) | ![GPTNext](https://leocaomecover.blob.core.windows.net/projectcover/MultimediaInputBox.gif) |

## Features 🚀
- ⚔**Session Records Saving** → The application uses IndexedDB as the database to guarantee the privacy and security of the session. All session records are saved and can be accessed later.
- 🔗**Persistent Session Mode** → This feature enables the AI to remember the context of the conversation and provide more accurate answers.
- 🤹‍♀️**Multiple Roles** → A variety of chat roles are built-in to make AI's answers more accurate.
- 👏**Readability** → Messages can be made playable by utilizing Microsoft's Speech Services.

## How to deploy 🎯

### To run this project, follow these steps:

1. Clone this repository to your local machine.

2. Install all the necessary dependencies by running pnpm install in the command line.

### Use Docker to launch the application by following these steps:

1. Pull the repository (main branch).
2. Run docker build -t gpt_next:latest .
3. Run docker run -d -p 1003:8080 --name gpt_next --restart=always gpt_next:latest
4. Enjoy!

### Alternatively, you can run the application using source code by following these steps:

1. Pull the repository (main branch).
2. Run pnpm install.
3. Run pnpm dev.
4. Enjoy!

## 🚧 Features List
- [x] Session records saving
- [x] Persistent session mode
- [x] Multiple roles
- [x] Support image generation
- [x] Support for editing conversations
- [x] Support Function Calling
- [x] Support OpenAI Vision API (Preview)
- [x] Support OpenAI Text to Speech (TTS) API

## 🐞 Bug List

## THANKS
- [anse-app/anse](https://github.com/anse-app/anse)
- [CatsJuice/ipad-cursor](https://github.com/CatsJuice/ipad-cursor)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Caojiahao-Coder/gpt_next&type=Date)](https://star-history.com/#Caojiahao-Coder/gpt_next&Date)

## FOSSA Status
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FCaojiahao-Coder%2Fgpt_next?ref=badge_large&issueType=license)

## LICENSE
MIT © [Leo Cao](https://github.com/Caojiahao-Coder)
