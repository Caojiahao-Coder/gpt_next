<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { themeColor } from './store/localstorage'

const style = computed<any>(() => ({
  '--theme-color': themeColor.value,
}))
</script>

<template>
  <main :style="style">
    <RouterView />
  </main>
</template>
