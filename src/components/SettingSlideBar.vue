<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import CommonSlideBar from './CommonSlideBar.vue'
import OpenAISetting from './OpenAISetting.vue'

const expand = ref<boolean>(true)

const { width } = useWindowSize()

/**
 * 关闭Setting栏
 */
function onCloseSettingBar() {
  expand.value = false
}

/**
 * 打开Setting栏
 */
function onOpenSettingBar() {
  expand.value = true
}

watch(width, (newValue, oldValue) => {
  expand.value = newValue >= 1200
})
</script>

<template>
  <div :class="expand === true ? 'w-320px' : 'w-0'" class="relative transition-all h-100vh flex flex-col color-base" b="0 l-1 solid gray-200 dark:dark-200">
    <div class="h-79px" p="x-16px" b="0 solid b-1 gray-200 dark:dark-200">
      <div class="flex flex-row h-100%">
        <div class="flex-1 flex flex-col">
          <div class="flex-1" />
          <div class="text-6">
            SETTING
          </div>
          <div class="flex-1" />
        </div>

        <div class="flex flex-col">
          <div class="flex-1" />
          <div class="icon-button i-carbon-close  text-6" @click="onCloseSettingBar" />
          <div class="flex-1" />
        </div>
      </div>
    </div>
    <OpenAISetting />
    <div class="flex-1" />
    <CommonSlideBar />
    <div
      v-if="expand === false"
      class="transition-all inline-block h-48px absolute top-24px hover-shadow"
      b="1 solid gray-200 dark:dark-200 rd-tl-3 rd-bl-3" left="-50px"
      @click="onOpenSettingBar"
    >
      <div class="i-carbon-settings icon-button m-12px" text-6 />
    </div>
  </div>
</template>
