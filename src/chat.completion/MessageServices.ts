import db from '@/database/db'
import type { TBMessageInfo } from '@/database/table-type'

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

export {
  getMessagesByConversationIdAsync,
  removeMessagesByConversationIdAsync,
}
