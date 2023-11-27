<script setup lang="ts">
import { ref } from 'vue'
import DailyTips from './DailyTips.vue'

defineProps<
  {
    isOpenSettingBar: boolean
  }
>()

const openDailyTips = ref<boolean>(false)

function onOpenDailyTips() {
  openDailyTips.value = true
}

function onCloseDailyTips() {
  openDailyTips.value = false
}
</script>

<template>
  <div
    class="transition-all inline-block h-48px absolute top-220px bg-base border-base z-1"
    :class="isOpenSettingBar ? 'right-320px' : 'right-0px'" b="1 solid rd-tl-3 rd-bl-3" @click="onOpenDailyTips"
  >
    <div data-cursor="block" class="i-carbon-help m-12px text-6 color-blue" />
  </div>

  <Transition>
    <DailyTips v-if="openDailyTips" @on-close="onCloseDailyTips" />
  </Transition>
</template>
