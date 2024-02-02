import { useStorage } from '@vueuse/core'
import type { Ref } from 'vue'

export const themeColor: Ref<string> = useStorage('icons-theme-color', '#329672')

export const gptRole: Ref<string> = useStorage('role', 'auto')

export const speechLang: Ref<string> = useStorage('speech-lang', 'zh-CN')

export const speechVoice: Ref<string> = useStorage('speech-voice', 'alloy')

export const ttsModels: Ref<string> = useStorage('tts-models', 'tts-1')

export const language: Ref<string> = useStorage('language', 'auto')

export const filterType: Ref<string> = useStorage('filterType', 'all')

export const expandLeftSideBar: Ref<boolean> = useStorage('expandLeftSideBar', true)

export const expandSettingSideBar: Ref<boolean> = useStorage('expandSettingSideBar', true)

export const alwaysCloseDailyTips: Ref<boolean> = useStorage('allowAutoPlay', false)

export const currentDailyTipsIndex: Ref<number> = useStorage('currentDailyTipsIndex', 0)

export const topP: Ref<number> = useStorage('topP', 0.5)

export const temperature: Ref<number> = useStorage('temperature', 0.5)

export const chatParameter: Ref<number> = useStorage('chatParameter', 1)
