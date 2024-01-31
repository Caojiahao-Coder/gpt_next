<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PromptsManagement from '@/components/PromptsManagement.vue'
import { gptRole } from '@/store/localstorage'
import Dialog from '@/ui/Dialog.vue'

const { t } = useI18n()

const role = ref<string>(window.localStorage.getItem('role') ?? 'auto')

const openManagePromptsDialog = ref<boolean>(false)

function toggleManagePromptsDialog() {
  openManagePromptsDialog.value = !openManagePromptsDialog.value
}

function onCloseDialog() {
  openManagePromptsDialog.value = false
}

watch(role, (newValue) => {
  gptRole.value = newValue
})
</script>

<template>
  <div class="border-base" b="0 b-1 solid">
    <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
      <div class="flex flex-row gap-2">
        <div class="i-carbon-chat h-18px w-18px m-3px" />
        <div class="h-24px flex-1 line-height-24px">
          {{ t('chat_setting') }}
        </div>
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
