import { addNewConversationAsync, getConversationByIdAsync, getConversationList as getConversationListAsync, removeConversationByIdAsync, updateConversationInfoAsync } from './ConversationServices'
import { removeMessagesByConversationIdAsync } from './MessageServices'
import type { NewConverstationInfo, TBConverstationInfo } from '@/database/table-type'

class ConversationController {
  /**
   * 获取对话列表
   * @returns
   */
  async getConversationListAsync(): Promise<TBConverstationInfo[]> {
    return await getConversationListAsync()
  }

  /**
   * 添加一个新的对话信息
   * @param info
   * @returns
   */
  async addConversationAsync(info: NewConverstationInfo): Promise<{
    result: boolean
    id: number
  }> {
    return await addNewConversationAsync(info)
  }

  /**
   * 通过Id获取对话信息
   * @param conversationId
   * @returns
   */
  async getConversationInfoByIdAsync(conversationId: number): Promise<TBConverstationInfo> {
    return await getConversationByIdAsync(conversationId)
  }

  /**
   * 通过对话ID删除对话（包含消息）
   * @param conversationId
   * @returns
   */
  async removeConversationByIdAsync(conversationId: number): Promise<boolean> {
    const removeConversationResult = await removeConversationByIdAsync(conversationId)
    if (!removeConversationResult)
      return false

    const result = await removeMessagesByConversationIdAsync(conversationId)

    return result
  }

  /**
   * 更新对话信息
   * @param info
   * @returns
   */
  async updateConversationInfoAsync(info: TBConverstationInfo): Promise<boolean> {
    return await updateConversationInfoAsync(info)
  }
}

const conversationController = new ConversationController()

export default conversationController
