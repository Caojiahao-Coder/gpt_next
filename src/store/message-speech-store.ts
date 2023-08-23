import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateAudioFile } from '@/microsoft/speech-services'
import message from '@/ui/message'

/**
 * 音频播放组件
 */
export const useMessageSpeechStore = defineStore('messageSpeechStore', () => {
  const { t } = useI18n()
  const isPlaying = ref<boolean>(false)

  // 是否显示播放组件
  const show = ref<boolean>(false)
  // 当前正在播放的文件名称
  const curPlayingFileName = ref<string>('')

  let currentAudio: HTMLAudioElement | null = null

  function playMessage(content: string, callback?: (status: 'pending' | 'processing' | 'finished') => void) {
    if (isPlaying.value === true) {
      message.info(t('speech_processing'))
      return
    }
    isPlaying.value = true
    if (callback)
      callback('pending')
    generateAudioFile(content, (fileName) => {
      if (fileName.length === 0) {
        isPlaying.value = false
        message.info(t('speech_error'))
        show.value = false
        if (callback)
          callback('finished')
        return
      }
      show.value = true
      if (callback)
        callback('processing')
      setTimeout(() => {
        const audioElement = document.createElement('audio')
        if (!audioElement)
          return
        audioElement!.src = `${import.meta.env.VITE_SPEECH_API}/${fileName}.mp3`
        audioElement!.play()
        currentAudio = audioElement
        audioElement.addEventListener('ended', () => {
          show.value = false
          isPlaying.value = false
          if (callback)
            callback('finished')
        })
        audioElement.addEventListener('pause', () => {
          show.value = false
          isPlaying.value = false
          if (callback)
            callback('finished')
        })
      }, 120)
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
})
