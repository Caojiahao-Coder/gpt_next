<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { Notifications, Notivue } from 'notivue'
import { alwaysCloseDailyTips, themeColor } from './store/localstorage'
import { isDark } from './store/dark'
import DailyTips from './components/DailyTips.vue'

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
  if (isDark.value === true) {
    const codeTheme = document.getElementById('code-theme') as HTMLLinkElement
    codeTheme.href = '/darcula.css'
  }
  else {
    const codeTheme = document.getElementById('code-theme') as HTMLLinkElement
    codeTheme.href = '/github.css'
  }
}
</script>

<template>
  <main :style="style">
    <RouterView />

    <Notivue v-slot="item">
      <Notifications :item="item" />
    </Notivue>

    <DailyTips v-if="!alwaysCloseDailyTips" />
  </main>
</template>
