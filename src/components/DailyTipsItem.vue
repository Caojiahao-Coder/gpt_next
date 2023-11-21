<script setup lang="ts">
import { isDark } from '@/store/dark'

defineProps<{
  info: {
    title: string
    description: string
    photo?: string
  }
}>()
</script>

<template>
  <div class="p-4 bg-base color-base" style="height: calc(100% - 32px);">
    <div class="flex flex-col gap-4 ">
      <div class="text-8 font-bold">
        {{ info.title }}
      </div>
      <div class="font-light text-5 line-height-32px">
        {{ info.description }}
      </div>
      <img :src="`${info.photo}${isDark === true ? '_dark' : ''}.gif`" class="b-rd-2 b-2 b-solid border-base">
    </div>
  </div>
</template>
