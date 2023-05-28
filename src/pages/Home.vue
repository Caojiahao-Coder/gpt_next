<script setup lang="ts">
import LeftSideBar from '@/components/LeftSideBar.vue'
</script>

<template>
  <main class="flex flex-row h-100vh bg-base">
    <LeftSideBar />
    <div flex="1" h="100%" bg="base" />
    <div w="320px" h="100%" bg="base" />
  </main>
</template>
