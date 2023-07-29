<script setup lang="ts">
import { setI18nLanguage } from '@/modules/i18n'

function toggleLocales() {
  const lang = localStorage.getItem('lang')
  if (lang === 'zhCN')
    setI18nLanguage('en')
  else
    setI18nLanguage('zhCN')
}
</script>

<template>
  <button
    m-auto
    data-cursor="block"
    icon-button
    color-base
    text-6
    p-0
    b-0
    h-38px
    line-height-38px
    i-carbon-language
    @click="toggleLocales()"
  />
</template>
