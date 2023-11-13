import { defineStore } from 'pinia'
import { ref } from 'vue'

const useOpenAIVisionStore = defineStore('openaiVisionStore', () => {
  const fileList = ref<{
    fileName: string
    fileData: string
  }[]>([])

  function uploadImageFile(fileName: string, fileData: string) {
    fileList.value.push({
      fileName,
      fileData,
    })
  }

  function clearUploadFileList() {
    fileList.value = []
  }

  function deleteFileByIndex(index: number) {
    fileList.value.splice(index, 1)
  }

  return {
    fileList,
    uploadImageFile,
    clearUploadFileList,
    deleteFileByIndex,
  }
})

export default useOpenAIVisionStore
