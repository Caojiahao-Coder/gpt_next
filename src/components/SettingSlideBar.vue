<script setup lang="ts">
import CommonSlideBar from './CommonSlideBar.vue'
import OpenAISetting from './OpenAISetting.vue'
</script>

<template>
  <div class="w-320px h-100vh flex flex-col color-base" b="0 l-1 solid gray-200 dark:dark-200">
    <div class="h-80px text-6 font-bold" p="x-16px" b="0 b-1 solid gray-200 dark:dark-200" style="line-height: 80px;">
      SETTING
    </div>
    <OpenAISetting />
    <div class="flex-1" />
    <CommonSlideBar />
  </div>
</template>
