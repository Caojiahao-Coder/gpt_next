<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  message: string
}>()

const messageRef = ref<HTMLDivElement>()
</script>

<template>
  <Transition name="fade">
    <div
      ref="messageRef" class="w-fit border-red-5 color-white bg-red-4 flex flex-row shadow" b="1 solid rd-1"
      p="x-3 y-2"
    >
      <div class="i-carbon-information h-18px w-18px" />
      <div class="m-l-2">
        {{ props.message }}
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .18s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
