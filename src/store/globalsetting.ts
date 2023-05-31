import { defineStore } from 'pinia'
import { useGlobalSettingDBStore } from './dbstore'

export interface GlobalSettingInfo {
  apiKey: string
  gptModel: string
}

export const useGlobalSettingStore = defineStore('globalSettingStore', () => {
  const globalSettingDB = useGlobalSettingDBStore().db

  async function getGlobalSetting(): Promise<{ apiKey: string; gptModel: string } | null> {
    const globalSetting = await globalSettingDB.globalSetting.toArray()
    if (globalSetting.length === 0)
      return null

    return {
      apiKey: globalSetting[0].openAIKey ?? '',
      gptModel: globalSetting[0].chatModel ?? '',
    }
  }

  return { getGlobalSetting }
})
