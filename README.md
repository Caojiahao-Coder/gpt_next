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
| ![68747470733a2f2f6c656f63616f6d65636f7665722e626c6f622e636f72652e77696e646f77732e6e65742f70726f6a656374636f7665722f44726177496d6167654d6f64652e676966](https://github.com/user-attachments/assets/2a600582-bf6f-42cd-a8bf-28d9a2c1d2f4)| ![68747470733a2f2f6c656f63616f6d65636f7665722e626c6f622e636f72652e77696e646f77732e6e65742f70726f6a656374636f7665722f46756e6374696f6e5f43616c6c696e672e676966](https://github.com/user-attachments/assets/85cecb71-646e-4c31-8123-d88e7ee335d3)|

| Text to Speech                  | Multimedia Input Box                        |
| ------------------------------- | ------------------------------------------- |
| ![68747470733a2f2f6c656f63616f6d65636f7665722e626c6f622e636f72652e77696e646f77732e6e65742f70726f6a656374636f7665722f5370656563682e676966](https://github.com/user-attachments/assets/c5038748-b578-41c0-9687-74360fbc64e8)| ![68747470733a2f2f6c656f63616f6d65636f7665722e626c6f622e636f72652e77696e646f77732e6e65742f70726f6a656374636f7665722f4d756c74696d65646961496e707574426f782e676966](https://github.com/user-attachments/assets/7c204ddb-049e-425e-bdc3-a9813b7f58bc)|

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
