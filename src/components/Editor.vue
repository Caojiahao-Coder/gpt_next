<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ref } from 'vue'

const expand = ref<boolean>(false)

const { width } = useWindowSize()

/**
 * 展开编辑器
 */
function onExpandEditor() {
  expand.value = true
}

/**
 * 隐藏编辑器
 */
function onCloseEditor() {
  expand.value = false
}
</script>

<template>
  <div
    class="color-base transition-all border-base" b="0 t-1 solid"
    :class="expand === true ? 'h-240px' : 'h-79px'"
  >
    <div
      class="flex flex-row p-24px" :class="[
        expand === true ? 'h-191px' : 'h-31px',
        expand === true ? 'bg-#f1f1f50 dark:bg-dark' : 'bg-base',
      ]"
    >
      <div v-if="width >= 1000" class="w-15%" />
      <div class="flex-1 flex flex-col">
        <div :class="expand === true ? 'h-0' : 'flex-1'" />
        <textarea
          overflow="x-hidden y-scroll"
          placeholder="Enter Something..."
          class="bg-transparent b-0 outline-none color-base text-4 h-100% p-0 m-0"
          :style="{ lineHeight: `${expand === true ? '24px' : '31px'}` }"
          @focus="onExpandEditor" @blur="onCloseEditor"
        />
        <div class="flex-1" />
      </div>
      <div class="flex flex-col">
        <div class="flex-1" />
        <div class="h-31px w-31px icon-button i-carbon-send-alt" />
        <div :class="expand === true ? 'h-0' : 'flex-1'" />
      </div>
      <div v-if="width >= 1000" class="w-15%" />
    </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  display: none;
}
</style>
