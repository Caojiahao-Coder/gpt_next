<script setup lang="ts">
import DarkSwitcher from '@/components/DarkSwitcher.vue'
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
//@ts-ignore
import config from '../../package.json'
</script>

<template>
  <div class="h-47px p-16px flex flex-row border-base gap-4" b="0 t-1 solid">
    <DarkSwitcher />
    <LocaleSwitcher />
    <div class="flex-1 flex flex-col">
      <div class="flex-1" />
      <div class="flex-1 text-right text-3 color-gray">
        Designed By <a class="decoration-dashed color-base hover-color-primary"
          href="https://github.com/Caojiahao-Coder">Leo Cao</a>.
      </div>
      <div class="flex-1" />
    </div>
    <div class="flex flex-col">
      <div class="flex-1" />
      <a href="https://leocao-me.vercel.app/gpt_next-updatelogs" class="text-right text-3 color-base flex flex-row gap-1 icon-button cursor-pointer">
        <div i-carbon-campsite />
        <div>
          {{ config.version }}
        </div>
      </a>
      <div class="flex-1" />
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: Light;
  src: url(../fonts/Light.ttf);
}

a {
  font-family: 'Light';
}
</style>
