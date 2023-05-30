<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  title: string
}>(), { })

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

function openModal() {
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.style.backgroundSize = '150%'
    appElement.style.filter = 'blur(.15rem)'
  }
}

function closeModal() {
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.style.filter = ''
    appElement.style.backgroundSize = '100%'
  }
}
</script>

<template>
  <div
    ref="dialogRoot" class="transition-all flex flex-row h-100vh w-screen left-0 top-0 color-base"
    :class="open === true ? 'fixed' : 'hidden'"
  >
    <div class="flex-1" />
    <div class="flex flex-col">
      <div class="flex-1" />
      <div
        class="bg-base border-base shadow-2xl" b="1 rd-1 solid"
        :class="width >= 1200 ? 'w-600px' : width >= 800 && width < 1200 ? 'w-500px' : 'w-300px'"
      >
        <div class="flex flex-row p-4 border-base" b="0 b-1 solid">
          <div class="flex-1 text-5 font-bold">
            {{ props.title }}
          </div>
          <div icon-button class="i-carbon-close text-5 h-24px" style="line-height: 24px;" @click="emits('onClose')" />
        </div>
        <div class="p-4">
          <slot />
        </div>
      </div>
      <div class="flex-1" />
    </div>
    <div class="flex-1" />
  </div>
</template>
