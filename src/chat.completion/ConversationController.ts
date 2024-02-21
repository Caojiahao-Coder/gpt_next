import { uid } from 'uid'
import { addNewConversationAsync, getConversationByIdAsync, getConversationList as getConversationListAsync, removeConversationByIdAsync, updateConversationInfoAsync } from './ConversationServices'
import { removeMessagesByConversationIdAsync } from './MessageServices'
import useConversationStore from '@/store/conversation-store'
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
    const result = await addNewConversationAsync(info)

    const conversationInfo = await getConversationByIdAsync(result.id)

    const conversationStore = useConversationStore()

    conversationStore.setConversationInfo(conversationInfo)

    conversationStore.updateConversationList()

    return result
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

    const conversationStore = useConversationStore()

    if (result) {
      if (conversationStore.conversationInfo?.id === conversationId)
        conversationStore.setConversationInfo(null)
    }

    return result
  }

  /**
   * 更新对话信息
   * @param info
   * @returns
   */
  async updateConversationInfoAsync(info: TBConverstationInfo): Promise<boolean> {
    const result = await updateConversationInfoAsync(info)

    if (result) {
      const conversationStore = useConversationStore()
      conversationStore.updateConversationList()
      conversationStore.updateConversationInfoById(info.id)
    }

    return result
  }

  async createDefaultConversationAsync(): Promise < {
    result: boolean
    id: number
  } > {
    const newInfo = {
      title: 'New Message',
      color: 'bg-gray',
      create_time: Date.now(),
      description: '',
      conversation_token: uid(32),
      type: 'chat',
      use_groq: false,
    } as NewConverstationInfo

    return await this.addConversationAsync(newInfo)
  }

  async createDataWorkerConversationAsync(): Promise<{
    result: boolean
    id: number
  }> {
    const newInfo = {
      title: 'Data Worker',
      color: 'bg-blue',
      create_time: Date.now(),
      description: '',
      conversation_token: uid(32),
      type: 'dataworker',
      use_groq: false,
    } as NewConverstationInfo

    return await this.addConversationAsync(newInfo)
  }

  async createDrawImageConversationAsync(): Promise<{
    result: boolean
    id: number
  }> {
    const newInfo = {
      title: 'Draw Image',
      color: 'bg-yellow-2',
      create_time: Date.now(),
      description: '',
      conversation_token: uid(32),
      type: 'draw_img_mode',
      use_groq: false,
    } as NewConverstationInfo

    return await this.addConversationAsync(newInfo)
  }
}

const conversationController = new ConversationController()

export default conversationController
