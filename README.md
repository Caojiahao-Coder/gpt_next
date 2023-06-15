![BANNER](./images/gpt_next.svg)

# GPT Next 

`GPT_NEXT` is an AI chat tool.

[🧭Live preview](https://gpt-next-shvd.vercel.app/)

## Features 🚀
- ⚔**Session Records Saving** → Using `IndexedDB` as the database can guarantee the privacy and security of the Session.
- 🔗**Persistent Session Mode** → Support persistent Session mode to make answers more accurate.
- 🤹‍♀️**Multiple Roles** → A variety of chat roles are built in to make AI's answers more accurate.

## How to deploy 🎯

### Docker
1. Pull repository (main branch)
2. RUN `docker build -t gpt_next:latest .`
3. RUN `docker run -d -p 1003:8080 --name gpt_next --restart=always gpt_next:latest`
4. Enjoy it.🎈

### Source code
1. Pull repository (main branch)
2. RUN `pnpm install`
3. RUN `pnpm dev`
4. Enjoy it.🎈

## 🚧 Features List
- [x] Session records saving
- [x] Persistent session mode
- [x] Multiple roles
- [ ] Support image generation
- [ ] Support for editing conversations

## 🐞 Bug List

## THANKS
- [anse-app/anse](https://github.com/anse-app/anse)

## LICENSE
MIT © [Leo Cao](https://github.com/Caojiahao-Coder)
