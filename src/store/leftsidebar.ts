import { useWindowSize } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLeftSideBarStore = defineStore('leftSideBarStore', () => {
  const { width } = useWindowSize()
  const expand = ref<boolean>(width.value >= 800)
  return { expand }
})
