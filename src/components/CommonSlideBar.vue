<script setup lang="ts">
import DarkSwitcher from '@/components/DarkSwitcher.vue'
</script>

<template>
  <div class="h-47px p-16px flex flex-rows" b="0 t-1 solid gray-200 dark:dark-200">
    <DarkSwitcher />
    <div class="flex-1 flex flex-col">
      <div class="flex-1" />
      <div class="flex-1 text-right text-3 color-gray">
        Designed By <a
          class="decoration-dashed color-base hover-color-primary"
          href="https://github.com/Caojiahao-Coder"
        >Leo Cao</a>.
      </div>
      <div class="flex-1" />
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: Light;
  src: url(../fonts/Light.ttf);
}
a{
  font-family: 'Light';
}
</style>
