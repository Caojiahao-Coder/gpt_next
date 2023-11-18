<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import VoiceList from '@/assets/voice-list'
import { speechVoice, ttsModels } from '@/store/localstorage'
import tts_models from '@/assets/tts-models-list'

const { t } = useI18n()

const voice = ref(speechVoice)
</script>

<template>
  <div class="border-base" b="0 b-1 solid">
    <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
      {{ t('speech_setting') }}
    </div>
    <div class="p-16px">
      <div class="text-3 color-gray" style="font-family: Light;">
        {{ t('tts_model') }}
      </div>
      <div class="m-t-2">
        <select
          v-model="ttsModels" class="w-full flex-1 border-base outline-none bg-body color-base" p="x-4 y-2"
          b="1 solid rd-1"
        >
          <option v-for="(item, index) in tts_models" :key="index" :value="item.value">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="text-3 color-gray mt-4" style="font-family: Light;">
        {{ t('voice_actor') }}
      </div>
      <div class="m-t-2">
        <select
          v-model="voice" class="w-full flex-1 border-base outline-none bg-body color-base" p="x-4 y-2"
          b="1 solid rd-1"
        >
          <option v-for="(item, index) in VoiceList" :key="index" :value="item.Code">
            {{ item.Voice }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
