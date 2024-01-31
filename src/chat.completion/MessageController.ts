import { getMessagesByConversationIdAsync } from './MessageServices'
import type { TBMessageInfo } from '@/database/table-type'

class MessageController {
  async getMessageByConversationIdAsync(conversationId: number): Promise<TBMessageInfo[]> {
    return await getMessagesByConversationIdAsync(conversationId)
  }
}

const messageController = new MessageController()

export default messageController
