<script setup lang="ts">
import { ref } from 'vue'

const expand = ref<boolean>(false)

function onExpandEditor() {
  expand.value = true
}

function onCloseEditor() {
  expand.value = false
}
</script>

<template>
  <div
    :class="[
      expand === true ? 'h-240px' : 'h-79px',
    ]" class="color-base transition-all"
    b="0 t-1 solid gray-200 dark:dark-200"
  >
    <div class="flex flex-rows p-24px" :class="expand === true ? 'h-191px' : 'h-31px'">
      <div class="w-15%" />
      <div class="flex-1 flex flex-col">
        <div v-if="expand === false" class="flex-1" />
        <input
          class="bg-base b-0 outline-none color-base block-words" placeholder="Enter Something..." @focus="onExpandEditor"
          @blur="onCloseEditor"
        >
        <div class="flex-1" />
      </div>
      <div class="flex flex-col">
        <div class="flex-1" />
        <div class="h-31px w-31px icon-button i-carbon-send-alt" />
        <div v-if="expand === false" class="flex-1" />
      </div>
      <div class="w-15%" />
    </div>
  </div>
</template>
