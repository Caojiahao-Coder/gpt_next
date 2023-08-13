<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  large?: boolean
  color: string
}>(), {
  large: false,
})

const emits = defineEmits(['onSelectedColor'])

const colorList: string[] = [
  'bg-red7',
  'bg-red6',
  'bg-red5',
  'bg-red4',
  'bg-red3',
  'bg-red2',

  'bg-pink7',
  'bg-pink6',
  'bg-pink5',
  'bg-pink4',
  'bg-pink3',
  'bg-pink2',

  'bg-purple7',
  'bg-purple6',
  'bg-purple5',
  'bg-purple4',
  'bg-purple3',
  'bg-purple2',

  'bg-yellow7',
  'bg-yellow6',
  'bg-yellow5',
  'bg-yellow4',
  'bg-yellow3',
  'bg-yellow2',

  'bg-blue7',
  'bg-blue6',
  'bg-blue5',
  'bg-blue4',
  'bg-blue3',
  'bg-blue2',

  'bg-green7',
  'bg-green6',
  'bg-green5',
  'bg-green4',
  'bg-green3',
  'bg-green2',

  'bg-gray7',
  'bg-gray6',
  'bg-gray5',
  'bg-gray4',
  'bg-gray3',
  'bg-gray2',
]

const openDialog = ref(false)

function onOpenColorDialog() {
  openDialog.value = true
}

function onSelectedColor(color: string) {
  emits('onSelectedColor', color)
  openDialog.value = false
}
</script>

<template>
  <div class="relative">
    <div
      data-cursor="block" class=" border-base" b="1 solid rd-1" :class="[
        props.color,
        large === true ? 'w-8 h-8' : 'w-4 h-4',
      ]" @click="onOpenColorDialog"
    />
    <Transition>
      <div
        v-if="openDialog" class="absolute grid grid-cols-6 gap-4 p-4 bg-base border-base shadow-2xl z100000 mt-1"
        b="1 solid rd-1"
      >
        <div
          v-for="(item, index) in colorList"
          :key="index" data-cursor="block" class="color-item border-base w-4 h-4" b="1 solid rd-1"
          :class="item" @click="onSelectedColor(item)"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
