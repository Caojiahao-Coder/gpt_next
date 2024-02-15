import { addNewMessageAsync, getMessageInfoByIdAsync, getMessagesByConversationIdAsync, removeMessageByIdAsync, removeMessagesByConversationIdAsync, updateMessageInfoAsync } from './MessageServices'
import type { NewMessageInfo, TBMessageInfo } from '@/database/table-type'

class MessageController {
  async getMessageByConversationIdAsync(conversationId: number): Promise<TBMessageInfo[]> {
    return await getMessagesByConversationIdAsync(conversationId)
  }

  async getMessageInfoByIdAsync(messageId: number): Promise<TBMessageInfo> {
    return await getMessageInfoByIdAsync(messageId)
  }

  async addNewMessageAsync(messageInfo: NewMessageInfo): Promise<{
    result: boolean
    id: number
  }> {
    return await addNewMessageAsync(messageInfo)
  }

  async clearMessagesByConversationIdAsync(conversationId: number): Promise<boolean> {
    return await removeMessagesByConversationIdAsync(conversationId)
  }

  async updateMessageInfoAsync(messageInfo: TBMessageInfo): Promise<boolean> {
    return await updateMessageInfoAsync(messageInfo)
  }

  async deleteMessageByIdAsync(messageId: number): Promise<boolean> {
    return await removeMessageByIdAsync(messageId)
  }
}

const messageController = new MessageController()

export default messageController
