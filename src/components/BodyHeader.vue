<script setup lang="ts">
import { useLeftSideBarStore } from '@/store/leftsidebar'

const leftSideBarStore = useLeftSideBarStore()

function onOpenLeftSideBar() {
  leftSideBarStore.expand = !leftSideBarStore.expand
}
</script>

<template>
  <div class="h-79px flex flex-row text-6 color-base" b="0 b-1 solid gray-200 dark:dark-200" p="x-24px">
    <div v-if="leftSideBarStore.expand === false" class="flex flex-col">
      <div class="flex-1" />
      <div class="icon-button i-carbon-menu" @click="onOpenLeftSideBar" />
      <div class="flex-1" />
    </div>
    <div class="flex-1" />
    <div class="flex flex-col">
      <div class="flex-1" />
      <div class="icon-button i-carbon-clean" />
      <div class="flex-1" />
    </div>
  </div>
</template>
