import { createVNode, render } from 'vue'
import MessageVue from './Message.vue'

const div = document.createElement('div')
div.setAttribute('class', 'message-container')
document.body.appendChild(div)

export default class Message {
  static error(message: string) {
    const messageContainer = document.createElement('div')
    const node = createVNode(MessageVue, { message })
    render(node, messageContainer)

    div.appendChild(messageContainer)

    setTimeout(() => {
      div.removeChild(messageContainer)
    }, 2000)
  }
}
