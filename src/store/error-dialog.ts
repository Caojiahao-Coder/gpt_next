import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useErrorDialogStore = defineStore('errorDialogStore', () => {
  const showErrorDialog = ref<boolean>(false)
  const message = ref<string>('')

  let timer: any = null

  watch(showErrorDialog, (newValue) => {
    if (newValue === true) {
      if (timer)
        clearTimeout(timer)

      timer = setTimeout(() => {
        showErrorDialog.value = false
        clearTimeout(timer)
      }, 3000)
    }
  })

  return { message, showErrorDialog }
})
