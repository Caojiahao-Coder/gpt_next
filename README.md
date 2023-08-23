![BANNER](./images/gpt_next.svg)

[CHINESE](./README.zh_CN.md)

# GPT Next 

> GPT Next is an AI chat tool that enables users to have conversations with an AI. The application is built using Vue.js as the frontend framework and utilizes IndexedDB as the database to guarantee the privacy and security of the session.

[🧭Live preview](https://gpt-next-shvd.vercel.app/)

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
- [ ] Support image generation
- [x] Support for editing conversations

## 🐞 Bug List

## THANKS
- [anse-app/anse](https://github.com/anse-app/anse)
- [CatsJuice/ipad-cursor](https://github.com/CatsJuice/ipad-cursor)

## LICENSE
MIT © [Leo Cao](https://github.com/Caojiahao-Coder)
