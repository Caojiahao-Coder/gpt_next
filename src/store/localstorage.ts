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

export const baseURL: Ref<string> = useStorage('baseURL', 'https://api.openai.com/v1/')

export const apiKey: Ref<string> = useStorage('apiKey', '')

export const gptModel: Ref<string> = useStorage('gptModel', 'gpt-4')

export const versionCode: Ref<string> = useStorage('versionCode', '')

export const groqBaseURL: Ref<string> = useStorage('groqBaseURL', 'https://api.groq.com/openai/v1/')

export const groqApiKey: Ref<string> = useStorage('groqApiKey', '')

export const groqModel: Ref<string> = useStorage('groqModel', 'mixtral-8x7b-32768')

export const alwaysUseGroq: Ref<boolean> = useStorage('alwaysUseGroq', false)
