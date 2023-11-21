import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useGlobalStore from './global-store'
import { speechVoice, ttsModels } from './localstorage'
import { push } from '@/main'
import { fetchText2Speech } from '@/openai/tts'

/**
 * 音频播放组件
 */
export const useMessageSpeechStore = defineStore('messageSpeechStore', () => {
  const { t } = useI18n()
  const isPlaying = ref<boolean>(false)

  const globalStore = useGlobalStore()

  // 是否显示播放组件
  const show = ref<boolean>(false)
  // 当前正在播放的文件名称
  const curPlayingFileName = ref<string>('')

  let currentAudio: HTMLAudioElement | null = null

  async function playMessage(content: string, callback?: (status: 'pending' | 'processing' | 'finished') => void) {
    if (isPlaying.value === true) {
      push.info(t('speech_processing'))
      return
    }

    if (callback)
      callback('pending')

    const globalSettingInfo = await globalStore.getGlobalSetting()

    fetchText2Speech({
      apikey: globalSettingInfo.api_key,
      body: {
        model: ttsModels.value,
        input: content,
        voice: speechVoice.value,
      },
    }).then(async (res) => {
      const reader = res.body?.getReader()

      const data: number[] = []

      await readFileData()

      async function readFileData() {
        const { done, value } = await reader!.read()
        if (value) {
          for (let j = 0; j < value.length; j++) {
            const item = value[j]
            data.push(item)
          }
        }
        if (!done)
          await readFileData()
      }

      const fileBate64 = convertBytes2Base64(data)

      setTimeout(() => {
        playAudio(fileBate64, () => {
          show.value = true
          isPlaying.value = true
          if (callback)
            callback('processing')
        }, () => {
          show.value = false
          isPlaying.value = false
          if (callback)
            callback('finished')
        }, () => {
          show.value = false
          isPlaying.value = false
          if (callback)
            callback('finished')
        })
      }, 100)
    }).catch(() => {
      push.info(t('speech_error'))
    }).finally(() => {
      show.value = false
      if (callback)
        callback('finished')
    })
  }

  function cancelSpeech() {
    if (currentAudio)
      currentAudio!.pause()
  }
  return {
    show,
    curPlayingFileName,
    playMessage,
    cancelSpeech,
  }

  function convertBytes2Base64(data: number[]) {
    const uintArray = new Uint8Array(data)

    let binaryString = ''

    uintArray.forEach((byte) => {
      binaryString += String.fromCharCode(byte)
    })

    const base64String = window.btoa(binaryString)

    return base64String
  }

  function playAudio(base64String: string, onStart: () => void, onEnd: () => void, onPause: () => void) {
    if (currentAudio !== null) {
      currentAudio.pause()
      currentAudio = null
    }
    const audio = new Audio(`data:audio/mp3;base64,${base64String}`)
    currentAudio = audio
    currentAudio.play()
    currentAudio.addEventListener('play', () => onStart())
    currentAudio.addEventListener('ended', () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio = null
      }
      onEnd()
    })
    currentAudio.addEventListener('pause', () => onPause())
  }
})
