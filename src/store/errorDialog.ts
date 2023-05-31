import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorDialogStore = defineStore('errorDialogStore', () => {
  const showErrorDialog = ref<boolean>(false)
  const message = ref<string>('')

  return { message, showErrorDialog }
})
