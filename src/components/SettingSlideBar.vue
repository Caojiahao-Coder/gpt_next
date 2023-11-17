<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CommonSlideBar from './CommonSlideBar.vue'
import OpenAISetting from './OpenAISetting.vue'
import ChatSetting from './ChatSetting.vue'
import DBSetting from './DBSetting.vue'
import MessageSpeechSetting from './MessageSpeechSetting.vue'
import ToolsSetting from './ToolsSetting.vue'
import FunctionCallingSetting from './FunctionCallingSetting.vue'
import { expandSettingSideBar } from '@/store/localstorage'

const { t } = useI18n()

function toggleExpandSettingSideBar() {
  expandSettingSideBar.value = !expandSettingSideBar.value
}
</script>

<template>
  <div
    :class="expandSettingSideBar === true ? 'w-320px' : 'w-0'"
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
          <div data-cursor="block" class="icon-button i-carbon-close  text-6" @click="toggleExpandSettingSideBar" />
          <div class="flex-1" />
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-y-scroll setting-bar-menu-list">
      <ChatSetting />
      <OpenAISetting />
      <ToolsSetting />
      <FunctionCallingSetting />
      <MessageSpeechSetting />
      <DBSetting />
    </div>
    <CommonSlideBar />
    <div
      v-if="expandSettingSideBar === false"
      class="transition-all inline-block h-48px absolute top-160px bg-base border-base" b="1 solid rd-tl-3 rd-bl-3"
      left="-50px" @click="toggleExpandSettingSideBar"
    >
      <div data-cursor="block" class="i-carbon-settings icon-button m-12px" text-6 />
    </div>
  </div>
</template>

<style scoped>
.setting-bar-menu-list::-webkit-scrollbar {
  width: 4px;
  border-left: 1px solid #33333380;
}

.setting-bar-menu-list::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #50505050;
}
</style>
