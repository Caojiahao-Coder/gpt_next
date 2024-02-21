<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from '@/ui/Dialog.vue'
import { gpt_models } from '@/assets/models-list'
import { push } from '@/main'
import { apiKey, baseURL, gptModel } from '@/store/localstorage'

const open = ref<boolean>(false)

const { t } = useI18n()

const baseURL_modal = ref<string>(baseURL.value)
const apiKey_modal = ref<string>(apiKey.value)
const gptModel_modal = ref<string>(gptModel.value)

const copyApiKeySuccess = ref<boolean>(false)
const copyApiKeyFailed = ref<boolean>(false)

function openEditModal() {
  open.value = true
}

async function onSaveOpenAIConfig() {
  try {
    if (!apiKey_modal.value || (apiKey_modal.value?.trim() ?? '').length === 0) {
      push.error(t('openai_setting.apikey_empty_error'))
      return
    }

    if (!baseURL_modal.value || (baseURL_modal.value?.trim() ?? '').length === 0) {
      push.error(t('openai_setting.baseurl_empty_error'))
      return
    }

    baseURL.value = baseURL_modal.value
    apiKey.value = apiKey_modal.value
    gptModel.value = gptModel_modal.value
    open.value = false
    push.success(t('openai_setting.save_success'))
  }
  catch {
    push.error(t('openai_setting.save_failed'))
    open.value = false
  }
}

/**
 * 复制OpenAI Api Key
 */
function copyOpenAiKey() {
  if (copyApiKeySuccess.value === true || copyApiKeyFailed.value === true)
    return

  if (!apiKey.value) {
    copyApiKeyFailed.value = true
    setTimeout(() => copyApiKeyFailed.value = false, 1200)
    return
  }
  navigator.clipboard.writeText(apiKey.value ?? '').then(() => {
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
    <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
      <div class="flex flex-row gap-2">
        <div class="h-24px flex-1 line-height-24px text-18px">
          Open AI
        </div>
        <div data-cursor="block" class="icon-button i-carbon-edit" @click="openEditModal" />
      </div>
    </div>
    <div class="p-16px">
      <div class="text-3 color-gray" style="font-family: Light;">
        Base URL
      </div>

      <div class="text-4 m-t-2" :class="baseURL ? 'color-base' : 'color-fade'">
        {{ baseURL ? baseURL : 'undefined' }}
      </div>

      <div class="text-3 color-gray m-t-4" style="font-family: Light;">
        {{ t('api_key') }}
      </div>
      <div class="flex flex-row gap-2  m-t-2">
        <div class="text-4" :class="apiKey ? 'color-base' : 'color-fade'">
          {{
            apiKey ? `${apiKey.substring(0, 6)}****${apiKey.substring(apiKey.length - 6, apiKey.length)}` : 'undefined'
          }}
        </div>
        <div
          data-cursor="block" class="icon-button text-4 h-20px line-height-20px" :class="[
            copyApiKeySuccess ? 'i-carbon-checkmark color-green' : copyApiKeyFailed ? 'i-carbon-close color-red' : 'i-carbon-copy',
          ]" @click="copyOpenAiKey"
        />
      </div>

      <div class="text-3 color-gray m-t-4" style="font-family: Light;">
        {{ t('chat_model') }}
      </div>
      <div class="text-4 m-t-2" :class="gptModel ? 'color-base' : 'color-fade'">
        {{
          gptModel ? gpt_models.filter(a => a.value === gptModel)[0].name : 'undefined'
        }}
      </div>
    </div>
  </div>

  <Dialog title="Open AI Setting" :open="open" @on-close="() => open = false">
    <div>
      <div>
        Base URL:
      </div>
      <div class="m-t-2 text-3 color-fade">
        {{ t('openai_setting.baseurl_hint') }}
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
        GPT Model:
      </div>
      <div class="flex flex-row m-t-2">
        <select
          v-model="gptModel_modal" class="flex-1 border-base outline-none bg-body color-base" p="x-4 y-2"
          b="1 solid rd-1"
        >
          <option v-for="(item, index) in gpt_models" :key="index" :value="item.value">
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
