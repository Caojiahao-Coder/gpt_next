<script setup lang="ts">
import DarkSwitcher from '../DarkSwitcher.vue'
import LocaleSwitcher from './LocaleSwitcher.vue'
</script>

<template>
  <div class="h-80px color-base line-height-80px border-base bg-base z-1" b="0 b-1 solid">
    <div class="max-w-1200px m-auto flex flex-row gap-16px p-x-4">
      <a class="brand" href="/">GPT_Next</a>
      <div class="flex-1" />
      <LocaleSwitcher />
      <DarkSwitcher />
      <div i-carbon-user m-auto w-24px h-24px icon-button />
    </div>
  </div>
</template>

<style scoped>
.brand {
  font-size: 36px;
  font-weight: bold;
  text-decoration: none;
  background: linear-gradient(90deg, rgba(247, 0, 208, 0.89) 0%, #9747FF 100%);
  -webkit-background-clip: text;
  color: transparent;
}
</style>
