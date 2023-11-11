<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { ToolInfo } from '@/openai/tool-call'
import Markdown from '@/components/Markdown.vue'

const props = defineProps<{
  functionCallingInfo: ToolInfo | undefined
}>()

const content = ref<string>('')

onMounted(() => {
  loadMarkdown()
})

watch(() => props.functionCallingInfo, () => loadMarkdown())

function loadMarkdown() {
  if (!props.functionCallingInfo) {
    content.value = ''
    return
  }

  const data = `
  # ${(props.functionCallingInfo?.function.name ?? '')}

  **${(props.functionCallingInfo?.function.description ?? '')}**

  Author: Leo Cao

  \`\`\` json
  ${JSON.stringify(props.functionCallingInfo?.function, null, 2)}
  \`\`\`
  `

  content.value = data
}
</script>

<template>
  <div class="p-4 flex-1">
    <Markdown :content="content" />
  </div>
</template>
