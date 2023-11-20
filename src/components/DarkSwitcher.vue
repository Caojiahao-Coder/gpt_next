<script setup lang="ts">
import { isDark } from '@/store/dark'

function onClick() {
  isDark.value = !isDark.value
}
</script>

<template>
  <button
    m-auto data-cursor="block" icon-button dark:i-carbon-haze-night i-carbon-haze color-base text-6 p-0 b-0 h-38px
    line-height-38px @click="onClick"
  />
</template>
