<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emits = defineEmits([
  'onCancel',
])

const rootRef = ref<HTMLDivElement>()

const isEnterPropsDialog = ref<boolean>(false)

function regOnMouseEnter() {
  if (rootRef.value) {
    isEnterPropsDialog.value = true
    rootRef.value!.onmouseleave = function () {
      emits('onCancel')
    }
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    isEnterPropsDialog.value = false
    setTimeout(() => {
      if (!isEnterPropsDialog.value)
        emits('onCancel')
    }, 800)
  }
})
</script>

<template>
  <div
    v-if="show" ref="rootRef" class=" bg-body absolute p-1 b-rd-1 border-base b-1 b-solid m-y-2 absolute"
    @mouseenter="regOnMouseEnter"
  >
    <slot />
  </div>
</template>

<style scoped>
* {
  user-select: none;
}
</style>
