import db from '@/database/db'
import type { NewMessageInfo, TBMessageInfo } from '@/database/table-type'

async function addNewMessageAsync(messageInfo: NewMessageInfo): Promise<{
  result: boolean
  id: number
}> {
  return new Promise<{
    result: boolean
    id: number
  }>((resolve) => {
    db.init().then(() => {
      db.add('tb_message', messageInfo).then((res) => {
        resolve({
          result: true,
          id: res as number,
        })
      }).catch(() => {
        resolve({
          result: false,
          id: -1,
        })
      })
    })
  })
}

async function getMessageInfoByIdAsync(messageId: number): Promise<TBMessageInfo> {
  return new Promise<TBMessageInfo>((resolve) => {
    db.init().then(() => {
      db.selectById('tb_message', messageId).then((res) => {
        resolve(res as TBMessageInfo)
      })
    })
  })
}

async function getMessagesByConversationIdAsync(conversationId: number): Promise<TBMessageInfo[]> {
  return new Promise<TBMessageInfo[]>((resolve) => {
    db.init().then(() => {
      db.select('tb_message', 'conversation_id', conversationId).then((res) => {
        resolve(res as TBMessageInfo[])
      })
    })
  })
}

async function removeMessagesByConversationIdAsync(conversationId: number): Promise<boolean> {
  await db.init()

  const messageList = await getMessagesByConversationIdAsync(conversationId)

  for (const message of messageList) {
    const result = await db.deleteById('tb_message', message.id)
    if (!result)
      return false
  }
  return true
}

async function updateMessageInfoAsync(messageInfo: TBMessageInfo): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    db.init().then(() => {
      db.update('tb_message', messageInfo).then((res) => {
        resolve(res as boolean)
      })
    })
  })
}

async function removeMessageByIdAsync(messageId: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    db.init().then(() => {
      db.deleteById('tb_message', messageId).then((res) => {
        resolve(res as boolean)
      })
    })
  })
}

export {
  addNewMessageAsync,
  getMessagesByConversationIdAsync,
  getMessageInfoByIdAsync,
  updateMessageInfoAsync,
  removeMessagesByConversationIdAsync,
  removeMessageByIdAsync,
}
