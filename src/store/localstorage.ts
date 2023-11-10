import { useStorage } from '@vueuse/core'

export const themeColor: any = useStorage('icons-theme-color', '#329672')

export const gptRole: any = useStorage('role', 'auto')

export const speechLang: any = useStorage('speech-lang', 'zh-CN')

export const speechVoice: any = useStorage('speech-voice', 'alloy')

export const ttsModels: any = useStorage('tts-models', 'tts-1')

export const language: any = useStorage('language', 'auto')
