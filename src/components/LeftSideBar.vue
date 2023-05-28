<script setup lang="ts">
</script>

<template>
  <div class="w-320px h-100vh bg-base flex flex-col color-base" b="0 r-1 solid gray-200 dark:dark-200">
    <div class="h-48px p-16px" b="0 b-1 solid gray-200 dark:dark-200">
      <div class="flex flex-rows" style="line-height: 48px;">
        <div class="flex-1 text-6 font-bold">
          CONVERSATIONS
        </div>
        <div i-carbon-add-comment class="text-6 icon-button" m="y-12px" />
      </div>
    </div>

    <!-- TODO:CONVERSATIONS HISTORY -->
    <div class="flex-1" />

    <div class="grid grid-cols-4 gap-6 h-47px" p="16px" b="0 t-1 solid gray-200 dark:dark-200">
      <div />
      <div icon-button w-24px h-24px m-auto i-carbon-logo-github />
      <div icon-button w-24px h-24px m-auto i-carbon-logo-vue />
      <div />
    </div>
  </div>
</template>
