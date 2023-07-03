<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeHighlight from 'rehype-highlight'

const contentRef = ref<HTMLDivElement>()

const needHidePadding = ref<boolean>(true)

const props = defineProps<{ content: string }>()

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
    .use(rehypeHighlight, { detect: true })
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(raw)

  return String(file)
}

</script>

<template>
  <div class="markdown-content" ref="contentRef" v-html="parseMarkdown(props.content)" :style="{
    margin: `${needHidePadding === false ? '-1rem 0' : '0'}`
  }" />
</template>


<style scoped>
.markdown-content {
  line-height: 32px;
  overflow: hidden;
  word-wrap: break-word;
}

.markdown-content>* {
  position: absolute;
}
</style>
