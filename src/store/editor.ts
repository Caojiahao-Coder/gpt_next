import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditorStore = defineStore('editorStore', () => {
  const thinking = ref<boolean>(false)
  return { thinking }
})
