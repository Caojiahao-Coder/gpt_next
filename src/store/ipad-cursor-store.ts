import { defineStore } from 'pinia'
import { ref } from 'vue'

const useIpadCursorStore = defineStore('ipadCursorStore', () => {
  const enable = ref<boolean>(
    window.localStorage.getItem('ipadCursor') === 'enable',
  )

  function toggleEnableIpadCursorAnimation() {
    window.localStorage.setItem('ipadCursor', enable.value ? 'disable' : 'enable')
    enable.value = !enable.value
  }

  return { enable, toggleEnableIpadCursorAnimation }
})

export default useIpadCursorStore
