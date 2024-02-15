import { addPromptDetail as addPromptDetailAsync, deletePromptDetailByIdAsync as deletePromptDetailByPromptIdAsync, getPromptDetailByIdAsync } from './PromptDetailServices'
import { addNewPromptAsync, deletePromptByIdAsync, getPromptInfoByIdAsync, getPromptListAsync, updatePromptInfoAsync } from './PromptServices'
import type { NewPromptDetailInfo, NewPromptInfo, TBPromptDetailInfo, TBPromptInfo } from '@/database/table-type'

/**
 * prompt 控制器
 */
class PromptController {
  async loadPromptListAsync(): Promise<TBPromptInfo[]> {
    return await getPromptListAsync()
  }

  async getPromptInfoByIdAsync(promptId: number): Promise<TBPromptInfo> {
    return await getPromptInfoByIdAsync(promptId)
  }

  async getPromptDetailByIdAsync(promptId: number): Promise<TBPromptDetailInfo[]> {
    return await getPromptDetailByIdAsync(promptId) as TBPromptDetailInfo[]
  }

  async addPromptAsync(data: NewPromptInfo): Promise<{ result: boolean;id: number }> {
    return await addNewPromptAsync(data)
  }

  async deletePromptAsync(promptId: number): Promise<boolean> {
    return await deletePromptByIdAsync(promptId)
  }

  async updatePromptAsync(newData: TBPromptInfo): Promise<boolean> {
    return await updatePromptInfoAsync(newData)
  }

  async addPromptDetailAsync(newData: NewPromptDetailInfo[]): Promise<boolean> {
    return await addPromptDetailAsync(newData)
  }

  async deletePromptDetailByPromptIdAsync(promptId: number) {
    return await deletePromptDetailByPromptIdAsync(promptId)
  }
}

const promptController = new PromptController()

export default promptController
