<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import CommonSlideBar from './CommonSlideBar.vue'
import OpenAISetting from './OpenAISetting.vue'
import ChatSetting from './ChatSetting.vue'

const { t } = useI18n()

const { width } = useWindowSize()

const expand = ref<boolean>(width.value >= 1200)

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

watch(width, (newValue) => {
  expand.value = newValue >= 1200
})
</script>

<template>
  <div
    :class="expand === true ? 'w-320px' : 'w-0'"
    class="relative transition-all h-100vh flex-shrink-0 flex flex-col color-base border-base" b="0 l-1 solid"
  >
    <div class="h-79px border-base" p="x-16px" b="0 solid b-1">
      <div class="flex flex-row h-100%">
        <div class="flex-1 flex flex-col">
          <div class="flex-1" />
          <div class="text-6 font-bold">
            {{ t('setting') }}
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
    <ChatSetting />
    <OpenAISetting />
    <div class="flex-1" />
    <CommonSlideBar />
    <div
      v-if="expand === false"
      class="transition-all inline-block h-48px absolute top-98px hover-shadow bg-base border-base"
      b="1 solid rd-tl-3 rd-bl-3" left="-50px" @click="onOpenSettingBar"
    >
      <div class="i-carbon-settings icon-button m-12px" text-6 />
    </div>
  </div>
</template>
