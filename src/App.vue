<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { themeColor } from './store/localstorage'
import { isDark } from './store/dark'

const style = computed<any>(() => ({
  '--theme-color': themeColor.value,
}))

onMounted(() => {
  changeBodyBgColor()
})

watch(isDark, () => {
  changeBodyBgColor()
})

function changeBodyBgColor() {
  if (isDark.value === true)
    document.body.style.backgroundColor = 'black'
  else
    document.body.style.backgroundColor = 'white'
}
</script>

<template>
  <main :style="style">
    <RouterView />
  </main>
</template>
