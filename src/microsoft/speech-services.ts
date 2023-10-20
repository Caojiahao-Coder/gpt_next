import { speechVoice } from '@/store/localstorage'

/**
 * Generate audio file by input content
 * @param content
 * @param callback
 */
function generateAudioFile(content: string, callback: (fileName: string) => void) {
  fetch(`${import.meta.env.VITE_SPEECH_API}/generate-audio-file`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify({
      content,
      voice: speechVoice.value,
    }),
  }).then((response) => {
    response.json().then((result: {
      Code: number
      FileName: string
    }) => {
      if (result.Code === 1) {
        if (callback)
          callback(result.FileName)
      }
      else {
        if (callback)
          callback('')
      }
    })
  }).catch(() => {
    if (callback)
      callback('')
  })
}

/**
 * 开始播放音频文件
 * @param fileName
 * @param statusChange
 */
function startPlayAudioFile(fileName: string, statusChange: (status: 'pending' | 'running' | 'finished') => void) {
  const context = new AudioContext()
  const request = new XMLHttpRequest()
  request.open('GET', `${import.meta.env.VITE_SPEECH_API}/musicSrc/${fileName}.wav`, true)
  request.responseType = 'arraybuffer'
  request.onload = function () {
    context.decodeAudioData(request.response, (buffer) => {
    })
  }
  request.send()
}

export {
  generateAudioFile,
  startPlayAudioFile,
}
