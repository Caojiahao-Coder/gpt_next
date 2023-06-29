<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emits = defineEmits([
  'onCancel',
])

const rootRef = ref<HTMLDivElement>()

function regOnMouseEnter() {
  if (rootRef.value) {
    rootRef.value!.onmouseleave = function () {
      emits('onCancel')
    }
  }
}
</script>

<template>
  <div
    v-if="show" ref="rootRef" class="dialog-root bg-body absolute p-1 b-rd-1 border-base b-1 b-solid m-y-2 absolute bottom-60px"
    @mouseenter="regOnMouseEnter"
  >
    <slot />
  </div>
</template>

<style scoped>
* {
  user-select: none;
}

.dialog-root {
  box-shadow: 0 0 16px #33333380;
}
</style>
