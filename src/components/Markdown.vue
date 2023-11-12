<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeHighlight from 'rehype-highlight'

const props = defineProps<{ content: string }>()

const contentRef = ref<HTMLDivElement>()

const needHidePadding = ref<boolean>(true)

onMounted(() => {
  needHidePadding.value = (contentRef.value?.firstChild?.nodeName)?.toString() === '#text'
})

/**
 * markdown text to html element
 * @param raw
 */
function parseMarkdown(raw: string) {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism, {
      ignoreMissing: true,
    })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(raw)

  return String(file)
}
</script>

<template>
  <div
    ref="contentRef" data-cursor="text" class="line-height-32px break-words overflow-hidden min-h-48px" :style="{
      margin: `${needHidePadding === false ? '-1rem 0' : '0'}`,
    }" v-html="parseMarkdown(props.content)"
  />
</template>

<style scoped>
.hljs {
  line-height: 24px !important;
}
</style>
