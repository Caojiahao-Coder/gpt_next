<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LangList from '@/assets/lang_list'
import { speechLang, speechVoice } from '@/store/localstorage'

const { t } = useI18n()

watch(speechLang, (newValue: string) => {
  speechVoice.value = LangList.filter(a => a.Code === newValue)[0].Voice[0].Code
})
</script>

<template>
  <div class="border-base" b="0 b-1 solid">
    <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
      {{ t('speech_setting') }}
    </div>
    <div class="p-16px">
      <div class="text-3 color-gray" style="font-family: Light;">
        {{
          t('language')
        }}
      </div>
      <div class="m-t-2">
        <select
          v-model="speechLang" class="w-full flex-1 border-base outline-none bg-body color-base" p="x-4 y-2"
          b="1 solid rd-1"
        >
          <option v-for="(item, index) in LangList" :key="index" :value="item.Code">
            {{ item.Lang }}
          </option>
        </select>
      </div>

      <div class="text-3 color-gray m-t-4" style="font-family: Light;">
        {{ t('voice_actor') }}
      </div>
      <div class="m-t-2">
        <select
          v-model="speechVoice" class="w-full flex-1 border-base outline-none bg-body color-base" p="x-4 y-2"
          b="1 solid rd-1"
        >
          <option
            v-for="(item, index) in LangList.filter(a => a.Code === speechLang)[0].Voice" :key="index"
            :value="item.Code"
          >
            {{ item.Lang }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
