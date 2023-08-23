<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { gptRole } from '@/store/localstorage'

const { t } = useI18n()

const role = ref<string>(window.localStorage.getItem('role') ?? 'auto')
const language = ref<string>(window.localStorage.getItem('language') ?? 'auto')

watch(role, (newValue) => {
  gptRole.value = newValue
})

watch(language, (newValue) => {
  window.localStorage.setItem('language', newValue)
})
</script>

<template>
  <div class="border-base" b="0 b-1 solid">
    <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
      {{ t('chat_setting') }}
    </div>
    <div class="p-16px">
      <div class="text-3 color-gray" style="font-family: Light;">
        {{ t('role') }}
      </div>
      <div class="text-4 m-t-2 w-full">
        <select v-model="role" class="w-full border-base outline-none bg-body color-base" p="x-4 y-2" b="1 solid rd-1">
          <option value="auto">
            {{ t('auto') }}
          </option>
          <option value="developer">
            {{ t('developer') }}
          </option>
          <option value="doctor">
            {{ t('doctor') }}
          </option>
          <option value="teacher">
            {{ t('teacher') }}
          </option>
          <option value="student">
            {{ t('student') }}
          </option>
          <option value="leader">
            {{ t('leader') }}
          </option>
          <option value="subordinate">
            {{ t('subordinate') }}
          </option>
          <option value="chinese_culture">
            {{ t('chinese_culture') }}
          </option>
        </select>
      </div>
      <div class="text-3 color-gray m-t-4" style="font-family: Light;">
        {{ t('language') }}
      </div>
      <div class="text-4 m-t-2 w-full">
        <select
          v-model="language" class="w-full border-base outline-none bg-body color-base" p="x-4 y-2"
          b="1 solid rd-1"
        >
          <option value="auto">
            {{ t('auto') }}
          </option>
          <option value="chinese">
            {{ t('chinese') }}
          </option>
          <option value="english">
            {{ t('english') }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
