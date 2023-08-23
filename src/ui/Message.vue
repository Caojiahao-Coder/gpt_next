<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  message: string
  type: 'error' | 'info'
}>()

const messageRef = ref<HTMLDivElement>()
</script>

<template>
  <Transition name="fade">
    <div ref="messageRef" class="w-fit color-white flex flex-row shadow" b="1 solid rd-1" :class="[
      type === 'error' ? ' border-red-5 bg-red-4' : 'border-blue-5 bg-blue-4']" p="x-3 y-2">
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
