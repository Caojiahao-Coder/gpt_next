<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Dialog from '@/ui/Dialog.vue'
import { useGlobalSettingStore } from '@/store/globalsetting'
import { useGlobalSettingDBStore } from '@/store/dbstore'

const open = ref<boolean>(false)

const apiKey_modal = ref<string>()
const gptModel_modal = ref<string>('gpt-3.5-turbo-0301')

const apiKey = ref<string | undefined>()
const gptModel = ref<string | undefined>()

const copyApiKeySuccess = ref<boolean>(false)
const copyApiKeyFailed = ref<boolean>(false)

onMounted(() => {
  loadOpenAISetting()
})

async function loadOpenAISetting() {
  const globalSettingStore = useGlobalSettingStore()
  const data = await globalSettingStore.getGlobalSetting()

  if (data) {
    apiKey.value = data.apiKey
    gptModel.value = data.gptModel
    apiKey_modal.value = data.apiKey
    gptModel.value = data.gptModel
  }
  else {
    apiKey.value = undefined
    gptModel.value = undefined
    apiKey_modal.value = ''
    gptModel_modal.value = ''
  }
}

function openEditModal() {
  open.value = true
}

async function onSaveOpenAIConfig() {
  const globalSettingDB = useGlobalSettingDBStore()
  if (await globalSettingDB.db.globalSetting.count() > 0)
    await globalSettingDB.db.globalSetting.clear()

  await globalSettingDB.db.globalSetting.add({
    openAIKey: apiKey_modal.value,
    chatModel: gptModel_modal.value,
  })
  open.value = false
  loadOpenAISetting()
}

/**
 * 复制OpenAI Api Key
 */
function copyOpenAiKey() {
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
      <div class="flex flex-row">
        <div class="h-24px flex-1" style="line-height: 24px;">
          Open AI
        </div>
        <div class="icon-button i-carbon-edit" @click="openEditModal" />
      </div>
    </div>
    <div class="p-16px">
      <div class="text-3 color-gray" style="font-family: Light;">
        Api Key
      </div>
      <div class="flex flex-row gap-2  m-t-2">
        <div class="text-4" :class="apiKey ? 'color-base' : 'color-fade'">
          {{
            apiKey ? `${apiKey.substring(0, 6)}****${apiKey.substring(apiKey.length - 6, apiKey.length)}` : 'undefined'
          }}
        </div>
        <div class="icon-button i-carbon-copy text-4 h-20px " style="line-height: 20px;" @click="copyOpenAiKey" />
        <div
          v-if="copyApiKeySuccess === true" class="i-carbon-checkmark color-green h-20px text-4"
          style="line-height:20px"
        />
        <div v-if="copyApiKeyFailed === true" class="i-carbon-close color-red h-20px text-4" style="line-height: 20px;" />
      </div>

      <div class="text-3 color-gray m-t-4" style="font-family: Light;">
        Chat Model
      </div>
      <div class="text-4 m-t-2" :class="apiKey ? 'color-base' : 'color-fade'">
        {{
          gptModel ? gptModel : 'undefined'
        }}
      </div>
    </div>
  </div>

  <Dialog title="Open AI Setting" :open="open" @on-close="() => open = false">
    <div>
      <div>
        Api Key:
      </div>
      <div class="flex flex-row m-t-2">
        <input
          v-model="apiKey_modal" class="flex-1 border-base outline-none bg-body color-base" type="password"
          placeholder="Please input your OpenAI Key" p="x-4 y-2" b="1 solid rd-1"
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
          <option value="gpt-3.5-turbo">
            gpt-3.5-turbo
          </option>
          <option value="gpt-4">
            gpt-4
          </option>
          <option value="gpt-4-0314">
            gpt-4-0314
          </option>
          <option value="gpt-4-32k">
            gpt-4-32k
          </option>
          <option value="gpt-4-32k-0314">
            gpt-4-32k-0314
          </option>
          <option value="gpt-3.5-turbo-0301">
            gpt-3.5-turbo-0301
          </option>
        </select>
      </div>

      <div class="flex flex-row m-t-4">
        <div class="flex-1" />
        <div class="flex flex-row gap-2">
          <button
            class="bg-body color-base outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
            @click="onSaveOpenAIConfig"
          >
            Save
          </button>
          <button
            class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1" p="x-4 y-2"
            @click="() => open = false"
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
