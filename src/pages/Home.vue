<script setup lang="ts">
import Editor from '@/components/Editor.vue'
import LeftSideBar from '@/components/LeftSideBar.vue'
import SettingSlideBar from '@/components/SettingSlideBar.vue'
</script>

<template>
  <main class="flex flex-row h-100vh bg-base">
    <LeftSideBar />
    <div flex="1" h="100%" class="flex flex-col">
      <div class="flex-1" />
      <Editor />
    </div>
    <SettingSlideBar />
  </main>
</template>
