<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Dialog from '@/ui/Dialog.vue'
import { useGlobalSettingDBStore } from '@/store/dbstore'

const open = ref<boolean>(false)

const globalSettingDB = useGlobalSettingDBStore()

const apiKey_modal = ref<string>()
const gptModel_modal = ref<string>('gpt-3.5-turbo-0301')

const apiKey = ref<string>('')
const gptModel = ref<string>('')

onMounted(() => {
  loadOpenAISetting()
})

function loadOpenAISetting() {
  globalSettingDB.db.globalSetting.toArray().then((res) => {
    if (res.length === 0)
      return

    apiKey_modal.value = res[0].openAIKey ?? ''
    gptModel_modal.value = res[0].chatModel ?? ''

    apiKey.value = res[0].openAIKey ?? ''
    gptModel.value = res[0].chatModel ?? ''
  })
}

function openEditModal() {
  open.value = true
}

async function onSaveOpenAIConfig() {
  if (await globalSettingDB.db.globalSetting.count() > 0)
    await globalSettingDB.db.globalSetting.clear()

  await globalSettingDB.db.globalSetting.add({
    openAIKey: apiKey_modal.value,
    chatModel: gptModel_modal.value,
  })
  open.value = false
  loadOpenAISetting()
}
</script>

<template>
  <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
    <div class="flex flex-row">
      <div class="h-24px flex-1" style="line-height: 24px;">
        Open AI
      </div>
      <div class="icon-button i-carbon-edit" @click="openEditModal" />
    </div>
  </div>
  <div class="p-16px border-base" b="0 b-1 solid">
    <div class="text-3 color-gray" style="font-family: Light;">
      Api Key
    </div>
    <div class="text-4 m-t-2">
      {{ apiKey.substring(0, 2) }}*****{{ apiKey.substring(apiKey.length - 2, apiKey.length) }}
    </div>

    <div class="text-3 color-gray m-t-4" style="font-family: Light;">
      Chat Model
    </div>
    <div class="text-4 m-t-2">
      {{ gptModel }}
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
          <option value="gpt-3.5-turbo-0301">
            gpt-3.5-turbo-0301
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
