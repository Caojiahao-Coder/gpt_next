<script setup lang="ts">
import { setI18nLanguage } from '@/modules/i18n'

function toggleLanguage() {
  if (window.localStorage.getItem('lang') === 'en')
    setI18nLanguage('zhCN')
  else
    setI18nLanguage('en')
}
</script>

<template>
  <div
    data-cursor="block"
    class="m-auto color-base icon-button text-6 p-0 b-0 h-38px line-height-38px i-carbon-ibm-watson-language-translator"
    @click="toggleLanguage"
  />
</template>
