import { defineStore } from 'pinia'
import { ref } from 'vue'

const useEditorStore = defineStore('editorStore', () => {
  const thinking = ref<boolean>(false)
  return { thinking }
})

export default useEditorStore
