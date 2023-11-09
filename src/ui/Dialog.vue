<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  title: string
}>(), {
})

const emits = defineEmits([
  'onClose',
])

const dialogRoot = ref<HTMLDivElement>()

const { width } = useWindowSize()

onMounted(() => {
  if (dialogRoot.value)
    document.body.append(dialogRoot.value)
})

watch(() => props.open, (newValue) => {
  if (newValue === true)
    openModal()
  else
    closeModal()
})

function listenerViewClick(event: MouseEvent) {
  const clickView = event.target as HTMLElement

  if (clickView.classList.contains('hide-view')) {
    emits('onClose')
    closeModal()
  }
}

function openModal() {
  setTimeout(() => {
    document.addEventListener('click', listenerViewClick)
  }, 200)
}

function closeModal() {
  document.removeEventListener('click', listenerViewClick)
}
</script>

<template>
  <Transition>
    <div
      v-if="open" ref="dialogRoot"
      class="flex flex-row h-100vh w-screen left-0 top-0 color-base backdrop-blur-3 fixed z-10"
    >
      <div class="flex-1 hide-view" />
      <div class="flex flex-col">
        <div class="flex-1 hide-view" />
        <div
          class="bg-base border-base shadow-2xl" b="1 rd-1 solid"
          :class="width >= 1200 ? 'w-600px' : width >= 800 && width < 1200 ? 'w-500px' : 'w-300px'"
        >
          <div class="flex flex-row p-4 border-base" b="0 b-1 solid">
            <div class="flex-1 text-5 font-bold">
              {{ props.title }}
            </div>
            <div
              data-cursor="block" icon-button class="i-carbon-close text-5 h-24px line-height-24px"
              @click="emits('onClose')"
            />
          </div>
          <div class="p-4">
            <slot />
          </div>
        </div>
        <div class="flex-1 hide-view" />
      </div>
      <div class="flex-1 hide-view" />
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
