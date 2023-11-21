<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DailyTipsItem from '@/components/DailyTipsItem.vue'
import { alwaysCloseDailyTips, currentDailyTipsIndex } from '@/store/localstorage'
import { DailyTipsList_CN, DailyTipsList_EN } from '@/assets/daily-tips-list'

const emits = defineEmits(['onClose'])

const { t } = useI18n()

const {
  width, height,
} = useWindowSize()

const lang = ref<string>(window.localStorage.getItem('lang') ?? 'en')

const DailyTipsList = ref<{
  title: string
  description: string
  photo?: string
}[]>(lang.value === 'zhCN' ? DailyTipsList_CN : DailyTipsList_EN)

const curDailyTips = ref<{
  title: string
  description: string
  phone?: string
}>(lang.value === 'zhCN' ? DailyTipsList_CN[currentDailyTipsIndex.value] : DailyTipsList_EN[currentDailyTipsIndex.value])

const curTipIndex = ref<number>(currentDailyTipsIndex.value)

function onCloseDailyTips() {
  const alwaysCloseInput = document.getElementById('always-close')

  if (alwaysCloseInput)
    alwaysCloseDailyTips.value = (alwaysCloseInput as HTMLInputElement).checked

  setTimeout(() => {
    const view = document.getElementById('daily-tips') as HTMLDivElement
    if (view)
      view.remove()
  }, 100)

  emits('onClose')
}

function onNextTip() {
  curTipIndex.value += 1
  loadTipInfo()
}

function onPrevTip() {
  curTipIndex.value -= 1
  loadTipInfo()
}

function loadTipInfo() {
  const DailyTipsList = lang.value === 'zhCN' ? DailyTipsList_CN : DailyTipsList_EN
  curTipIndex.value = Math.max(0, curTipIndex.value)
  curTipIndex.value = Math.min(curTipIndex.value, DailyTipsList.length - 1)
  currentDailyTipsIndex.value = curTipIndex.value
  curDailyTips.value = DailyTipsList[curTipIndex.value]
}
</script>

<template>
  <div id="daily-tips" class="fixed w-100% h-100% top-0 left-0 backdrop-blur-4 color-base flex flex-col z-100">
    <div
      class="absolute top-6 right-6 p-2 icon-button b-rd border-base hover-bg-body b-1 b-solid"
      @click="onCloseDailyTips"
    >
      <div class="text-6 font-bold color-red i-carbon-close" />
    </div>
    <div class="flex-1" />
    <div
      class="bg-base m-auto b-rd border-solid b-1 border-base shadow-xl flex flex-col" :class="[
        width < 768 ? 'w-90%' : width < 1024 ? 'w-70%' : width < 1280 ? 'w-60%' : 'w-40%',
        height < 768 ? 'h-75%' : height < 1024 ? 'h-65%' : height < 1280 ? 'h-55%' : 'h-35%',
      ]"
    >
      <div class="p-4 b-0 b-b-1 border-base border-solid">
        <div>{{ t('daily_tips') }}</div>
      </div>

      <div class="flex-1 flex flex-col overflow-y-scroll overflow-x-hidden tips-content">
        <div class="flex-1">
          <DailyTipsItem :info="curDailyTips" />
        </div>
      </div>

      <div class="h-6px bg-base b-0 b-t-1 b-solid border-base flex flex-row gap-1 py-2px p-1">
        <div
          v-for="(_, index) in DailyTipsList" :key="index" class="w-full b-rd-4 b-1 b-solid border-base transition-all"
          :class="[
            index <= curTipIndex ? 'bg-green-8 dark-bg-green-6' : 'bg-body',
          ]"
        />
      </div>
      <div class="p-x-4 p-y-2 b-0 b-t-1 border-base border-solid flex flex-row gap-2">
        <div class="flex-1 flex flex-row gap-2">
          <input
            id="always-close" type="checkbox" class="m-y-10px p-0 w-16px h-16px"
            :checked="alwaysCloseDailyTips === true"
          >
          <div class="h-36px line-height-36px">
            {{ t('always_close_daily_tips') }}
          </div>
        </div>
        <button class="bg-body hover-bg-base b-rd b-solid b-1 border-base color-base p-2" @click="onPrevTip">
          {{ t('previous_page') }}
        </button>
        <button class="bg-body hover-bg-base b-rd b-solid b-1 border-base color-base p-2" @click="onNextTip">
          {{ t('next_page') }}
        </button>
        <button
          class="bg-body hover-bg-base b-rd b-solid b-1 border-base color-base p-2 color-red"
          @click="onCloseDailyTips"
        >
          {{ t('cancel') }}
        </button>
      </div>
    </div>
    <div class="flex-1" />
  </div>
</template>

<style scoped>
.tips-content::-webkit-scrollbar {
  display: none;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
