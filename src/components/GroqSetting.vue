<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { groqApiKey, groqBaseURL, groqModel } from '@/store/localstorage'
import Dialog from '@/ui/Dialog.vue'
import { groq_models } from '@/assets/models-list'
import { push } from '@/main'

const open = ref<boolean>(false)
const baseURL_modal = ref<string>(groqBaseURL.value)
const apiKey_modal = ref<string>(groqApiKey.value)
const groqModel_modal = ref<string>(groqModel.value)
const { t } = useI18n()

function onSaveOpenAIConfig() {
  try {
    if (!apiKey_modal.value || (apiKey_modal.value?.trim() ?? '').length === 0) {
      push.error(t('groq_setting.apikey_empty_error'))
      return
    }

    if (!baseURL_modal.value || (baseURL_modal.value?.trim() ?? '').length === 0) {
      push.error(t('groq_setting.baseurl_empty_error'))
      return
    }

    groqBaseURL.value = baseURL_modal.value
    groqApiKey.value = apiKey_modal.value
    groqModel.value = groqModel_modal.value
    open.value = false
    push.success(t('groq_setting.save_success'))
  }
  catch {
    push.error(t('groq_setting.save_failed'))
    open.value = false
  }
}

const copyApiKeySuccess = ref<boolean>(false)
const copyApiKeyFailed = ref<boolean>(false)

/**
 * 复制OpenAI Api Key
 */
function copyOpenAiKey() {
  if (copyApiKeySuccess.value === true || copyApiKeyFailed.value === true)
    return

  if (!groqApiKey.value) {
    copyApiKeyFailed.value = true
    setTimeout(() => copyApiKeyFailed.value = false, 1200)
    return
  }
  navigator.clipboard.writeText(groqApiKey.value ?? '').then(() => {
    copyApiKeySuccess.value = true
    setTimeout(() => {
      copyApiKeySuccess.value = false
    }, 1200)
  }).catch(() => {
    copyApiKeyFailed.value = true
    setTimeout(() => copyApiKeyFailed.value = false, 1200)
  })
}
</script>

<template>
  <div class="border-base" b="0 b-1 solid">
    <div class="text-18px font-700 " p="t-16px l-16px r-16px">
      <div class="flex flex-row gap-2">
        <div class="h-24px flex-1 line-height-24px text-18px">
          Groq
        </div>

        <div data-cursor="block" class="icon-button i-carbon-edit" @click="() => open = true" />
      </div>
    </div>

    <div class="p-16px">
      <div class="text-3 color-gray" style="font-family: Light;">
        Base URL:
      </div>

      <div class="text-4 m-t-2" :class="groqBaseURL.length <= 0 ? 'color-fade' : 'color-base'">
        {{ groqBaseURL ? groqBaseURL : 'undefined' }}
      </div>
    </div>

    <div class="p-16px p-t-0">
      <div class="text-3 color-gray" style="font-family: Light;">
        {{ t('api_key') }}
      </div>

      <div class="flex flex-row gap-2  m-t-2">
        <div class="text-4" :class="groqApiKey ? 'color-base' : 'color-fade'">
          {{
            groqApiKey ? `${groqApiKey.substring(0, 6)}****${groqApiKey.substring(groqApiKey.length - 6, groqApiKey.length)}` : 'undefined'
          }}
        </div>
        <div
          data-cursor="block" class="icon-button text-4 h-20px line-height-20px" :class="[
            copyApiKeySuccess ? 'i-carbon-checkmark color-green' : copyApiKeyFailed ? 'i-carbon-close color-red' : 'i-carbon-copy',
          ]" @click="copyOpenAiKey"
        />
      </div>
    </div>

    <div class="p-16px p-t-0">
      <div class="text-3 color-gray" style="font-family: Light;">
        {{ t('chat_model') }}
      </div>

      <div class="text-4 m-t-2" :class="groqModel.length <= 0 ? 'color-fade' : 'color-base'">
        {{ groq_models.filter(a => a.value === groqModel)[0].name }}
      </div>
    </div>
  </div>

  <Dialog title="Groq Setting" :open="open" @on-close="() => open = false">
    <div>
      <div>
        Base URL:
      </div>
      <div class="m-t-2 text-3 color-fade">
        {{ t('groq_setting.baseurl_hint') }}
      </div>
      <div class="flex flex-row m-t-2">
        <input
          v-model="baseURL_modal" data-cursor="text" class="flex-1 border-base outline-none bg-body color-base" type="text"
          placeholder="Please input your Base URL" p="x-4 y-2" b="1 solid rd-1"
        >
      </div>

      <div class="m-t-4">
        Api Key:
      </div>
      <div class="flex flex-row m-t-2">
        <input
          v-model="apiKey_modal" data-cursor="text" class="flex-1 border-base outline-none bg-body color-base"
          type="password" placeholder="Please input your OpenAI Key" p="x-4 y-2" b="1 solid rd-1"
        >
      </div>
      <div class="m-t-4">
        Groq Model:
      </div>
      <div class="flex flex-row m-t-2">
        <select
          v-model="groqModel_modal" class="flex-1 border-base outline-none bg-body color-base" p="x-4 y-2"
          b="1 solid rd-1"
        >
          <option v-for="(item, index) in groq_models" :key="index" :value="item.value">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="flex flex-row m-t-4">
        <div class="flex-1" />
        <div class="flex flex-row gap-2">
          <button
            data-cursor="block" class="bg-body color-base outline-none border-base hover-bg-base" b="1px solid rd-1"
            p="x-4 y-2" @click="onSaveOpenAIConfig"
          >
            Save
          </button>
          <button
            data-cursor="block" class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1"
            p="x-4 y-2" @click="() => open = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
@font-face {
  font-family: Light;
  src: url(../fonts/Light.ttf);
}
</style>
