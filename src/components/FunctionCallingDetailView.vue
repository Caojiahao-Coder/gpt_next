<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FunctionInfo } from '@/openai/type/chat.completion.function.calling'
import Markdown from '@/components/Markdown.vue'

const props = defineProps<{
  functionCallingInfo: FunctionInfo | undefined
}>()

const { t } = useI18n()

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
  # ${t(`functionCallingList.${(props.functionCallingInfo?.function.name ?? '')}`)}

  **${t(`functionCallingList.${(props.functionCallingInfo?.function.description ?? '')}`)}**

  ${t('functionCallingList.author')}: Leo Cao

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
