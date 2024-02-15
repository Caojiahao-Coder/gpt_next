<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

const props = withDefaults(defineProps<{
  open: boolean
  title: string
  padding?: boolean
  defaultFullScreen?: boolean
  canClose?: boolean
}>(), {
  padding: true,
  canClose: true,
})

const emits = defineEmits([
  'onClose',
])

const { width } = useWindowSize()

const dialogRoot = ref<HTMLDivElement>()

const expandDialog = ref<boolean>(props.defaultFullScreen ?? false)

function toggleExpandDialog() {
  expandDialog.value = !expandDialog.value
}

onMounted(() => {
  if (dialogRoot.value)
    document.body.append(dialogRoot.value)
})

watch(() => props.open, (newValue) => {
  if ((props.defaultFullScreen ?? false) === false)
    expandDialog.value = false
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
      class="flex flex-row h-100vh w-screen left-0 top-0 color-base backdrop-blur-3 fixed z-100 transition-all"
    >
      <div
        class="hide-view transition-all" :class="[
          expandDialog ? 'w-24px' : (
            width < 768 ? 'w-5% min-w-24px' : width < 1024 ? 'w-25% min-w-24px' : 'w-30% min-w-24px'
          ),
        ]"
      />
      <div class="flex flex-col flex-1 h-full">
        <div
          class="hide-view transition-all flex-shrink-0" :class="[
            expandDialog ? 'h-24px' : 'flex-1 min-h-24px',
          ]"
        />
        <div
          class="bg-base border-base b-1 b-solid b-rd shadow-2xl  w-full transition-all flex flex-col overflow-hidden"
          :class="[expandDialog ? 'flex-1' : '']"
        >
          <div class="flex flex-row p-4 border-base gap-2 b-0 b-b-1 b-solid">
            <div class="flex-1 text-5 font-bold">
              {{ props.title }}
            </div>
            <div
              class="icon-button text-4 h-24px line-height-24px" :class="[
                expandDialog ? 'i-carbon-minimize' : 'i-carbon-maximize',
              ]" @click="toggleExpandDialog"
            />
            <div
              v-if="canClose"
              data-cursor="block" icon-button class="i-carbon-close text-7 h-24px line-height-24px"
              @click="emits('onClose')"
            />
          </div>
          <div class=" flex-1 overflow-y-scroll dialog-content-view" :class="padding ? 'p-4' : 'p0'">
            <slot />
          </div>
        </div>
        <div
          class="hide-view transition-all flex-shrink-0" :class="[
            expandDialog ? 'h-24px' : 'flex-1 min-h-24px',
          ]"
        />
      </div>
      <div
        class="hide-view transition-all" :class="[
          expandDialog ? 'w-24px' : (
            width < 768 ? 'w-5% min-w-24px' : width < 1024 ? 'w-25% min-w-24px' : 'w-30% min-w-24px'
          ),
        ]"
      />
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

.dialog-content-view::-webkit-scrollbar {
  display: none;
}
</style>
