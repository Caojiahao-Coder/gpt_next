<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import VueSlider, { type MarksProp } from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import PromptsManagement from '@/components/PromptsManagement.vue'
import { gptRole, temperature, topP } from '@/store/localstorage'
import Dialog from '@/ui/Dialog.vue'
import ChatParameterList from '@/assets/chat-parameter-list'

const { t } = useI18n()

const role = ref<string>(window.localStorage.getItem('role') ?? 'auto')

const openManagePromptsDialog = ref<boolean>(false)

const v_topP = ref<number>(Number.parseFloat(window.localStorage.getItem('topP') ?? '0.5'))
const v_temperature = ref<number>(Number.parseFloat(window.localStorage.getItem('temperature') ?? '0.5'))
const v_chatParameter = ref<number>(Number.parseInt(window.localStorage.getItem('chatParameter') ?? '1'))

function toggleManagePromptsDialog() {
  openManagePromptsDialog.value = !openManagePromptsDialog.value
}

function onCloseDialog() {
  openManagePromptsDialog.value = false
}

watch(role, (newValue) => {
  gptRole.value = newValue
})

watch(v_topP, (newValue) => {
  if (v_chatParameter.value === 1)
    topP.value = newValue
})

watch(v_temperature, (newValue) => {
  if (v_chatParameter.value === 1)
    temperature.value = newValue
})

watch(v_chatParameter, (newValue) => {
  window.localStorage.setItem('chatParameter', newValue.toString())
  const info = ChatParameterList.find(item => item.id === newValue)
  if (info?.id !== 1) {
    v_topP.value = info?.topP ?? 0.5
    v_temperature.value = info?.temperature ?? 0.5
    topP.value = info?.topP ?? 0.5
    temperature.value = info?.temperature ?? 0.5
  }
  else {
    v_topP.value = topP.value
    v_temperature.value = temperature.value
  }
})

const topPMark: MarksProp = {
  0: '0',
  1: '1',
}

const temperatureMark: MarksProp = {
  0: '0',
  1: '1',
}
</script>

<template>
  <div class="border-base" b="0 b-1 solid">
    <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
      <div class="h-24px flex-1 line-height-24px">
        {{ t('chat_setting') }}
      </div>
    </div>

    <div class="p-16px">
      <div class="text-3 color-gray" style="font-family: Light;">
        {{ t('prompts') }}
      </div>

      <div class="relative">
        <button
          class="mt-2 bg-body  color-base outline-none border-base hover-bg-base w-full transition-all px-4 py-2 b-1 b-solid border-base b-rd"
          @click="toggleManagePromptsDialog"
        >
          {{ t("manage_prompts") }}
        </button>
      </div>
    </div>

    <div class="p-x-16px">
      <div class="text-3 color-gray" style="font-family: Light;">
        {{ t('chatParameterList.title') }}
      </div>

      <select
        v-model="v_chatParameter" class="w-full flex-1 border-base outline-none bg-body color-base mt-2" p="x-4 y-2"
        b="1 solid rd-1"
      >
        <option
          v-for="(item, index) in ChatParameterList " :key="index" :value="item.id"
          :selected="item.id === v_chatParameter"
        >
          {{ t(item.name) }}
        </option>
      </select>
    </div>

    <div class="p-x-16px p-t-16px p-b-32px">
      <div class="text-3 color-gray" style="font-family: Light;">
        Top P:<span class="color-base m-l-8px">
          {{ v_topP }}
        </span>
      </div>

      <VueSlider
        v-model="v_topP" :min="0" :max="1" :interval="0.1" :marks="topPMark" class="m-t-8px" tooltip="none"
        :disabled="v_chatParameter !== 1"
      />
    </div>

    <div class="p-x-16px p-b-32px">
      <div class="text-3 color-gray" style="font-family: Light;">
        Temperature: <span class="color-base m-l-8px">
          {{ v_temperature }}
        </span>
      </div>

      <VueSlider
        v-model="v_temperature" :min="0" :max="1" :interval="0.1" :marks="temperatureMark" class="m-t-8px"
        tooltip="none" :disabled="v_chatParameter !== 1"
      />
    </div>
  </div>

  <Dialog
    :open="openManagePromptsDialog" :title="t('manage_prompts')" :padding="false" :default-full-screen="true"
    @on-close="onCloseDialog"
  >
    <PromptsManagement @on-close="onCloseDialog" />
  </Dialog>
</template>

<style scoped>
#newPanel {
  background: linear-gradient(221deg, rgba(255, 0, 0, 0.50) 17.49%, rgba(255, 245, 0, 0.34) 85.01%), linear-gradient(115deg, rgba(255, 199, 0, 0.60) 34.42%, rgba(0, 255, 194, 0.60) 100%), linear-gradient(251deg, rgba(255, 0, 0, 0.60) 0%, rgba(191, 7, 255, 0.60) 100%);
}
</style>
