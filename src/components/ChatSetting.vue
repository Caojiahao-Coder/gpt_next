<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const role = ref<string>(window.localStorage.getItem('role') ?? 'auto')
const language = ref<string>(window.localStorage.getItem('language') ?? 'auto')

watch(role, (newValue, oldValue) => {
  window.localStorage.setItem('role', newValue)
})

watch(language, (newValue, oldValue) => {
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
      <div class="text-4 m-t-2 flex flex-1">
        <select
          v-model="role" class="flex-1 border-base outline-none bg-body color-base"
          p="x-4 y-2" b="1 solid rd-1"
        >
          <option value="auto">
            Auto
          </option>
          <option value="developer">
            Developer
          </option>
          <option value="doctor">
            Doctor
          </option>
          <option value="teacher">
            Teacher
          </option>
          <option value="student">
            Student
          </option>
          <option value="leader">
            Leader
          </option>
          <option value="subordinate">
            Subordinate
          </option>
        </select>
      </div>
      <div class="text-3 color-gray m-t-4" style="font-family: Light;">
        {{ t('language') }}
      </div>
      <div class="text-4 m-t-2 flex flex-row">
        <select
          v-model="language" class="flex-1 border-base outline-none bg-body color-base"
          p="x-4 y-2" b="1 solid rd-1"
        >
          <option value="auto">
            Auto
          </option>
          <option value="chinese">
            Chinese
          </option>
          <option value="english">
            English
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
