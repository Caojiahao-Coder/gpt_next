<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from '@/ui/Dialog.vue'
import { exportDBFileToJson, restoreDatabase } from '@/database/utils'
import { push } from '@/main'

const { t } = useI18n()

const showExportSuccess = ref<boolean>(false)

const showDialog = ref<boolean>(false)

function backupDatabase() {
  showDialog.value = true
}

function onBackup() {
  exportDBFileToJson((status) => {
    switch (status) {
      case 'waiting':
        break

      case 'processing':
        break

      case 'finished':
        showDialog.value = false
        showExportSuccess.value = true
        setTimeout(() => {
          showExportSuccess.value = false
        }, 2000)
        break

      case 'failed':
        showDialog.value = false
        break
    }
  })
}

function onRestoreDatabase() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.click()

  input.onchange = function (event: Event) {
    const fileList = (event.target as HTMLInputElement).files

    if (!fileList || fileList.length <= 0)
      return

    const file = fileList[0] as Blob
    const reader = new FileReader()

    reader.onloadend = function (res) {
      let content = ''

      if (res.target?.result)
        content = res.target!.result as string

      const jsonData = JSON.parse(content)

      const result = restoreDatabase(jsonData)

      if (result) {
        push.info(t('restore_db_success'))
        setTimeout(() => {
          window.location.reload()
        }, 600)
      }
      else { push.error(t('restore_db_failed')) }
    }

    reader.readAsText(file)
  }
}

function onCloseDialog() {
  showDialog.value = false
}
</script>

<template>
  <div>
    <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
      {{ t('db_setting') }}
    </div>

    <div class="p-16px">
      <div class="text-3 color-gray" style="font-family: Light;">
        <button
          data-cursor="block" class="outline-none border-base hover-bg-base w-full transition-all flex flex-row gap-2" b="1px solid rd-1"
          p="x-4 y-2"
          :class="showExportSuccess ? 'bg-green color-white' : 'bg-body  color-base'"
          @click="backupDatabase"
        >
          <div class="flex-1" />
          <div v-if="showExportSuccess" class="i-carbon-checkmark text-5 transition-all" />
          <div>
            {{
              showExportSuccess ? 'Backup successfully!' : t('backup_db')
            }}
          </div>
          <div class="flex-1" />
        </button>
      </div>

      <div class="text-3 color-gray mt-2" style="font-family: Light;">
        <button
          data-cursor="block" class="bg-body  color-base outline-none border-base hover-bg-base w-full transition-all" b="1px solid rd-1"
          p="x-4 y-2"
          @click="onRestoreDatabase"
        >
          {{ t('restore_db') }}
        </button>
      </div>
    </div>
  </div>

  <Dialog :title="t('db_setting')" :open="showDialog" @on-close="onCloseDialog">
    <div>
      {{ t('db_setting_desc') }}
    </div>

    <div class="flex flex-row-reverse gap-2 mt-4">
      <button
        data-cursor="block" class="bg-body color-red outline-none border-base hover-bg-base" b="1px solid rd-1"
        p="x-4 y-2" @click="onCloseDialog"
      >
        Cancel
      </button>

      <button
        data-cursor="block" class="bg-body color-base outline-none border-base hover-bg-base" b="1px solid rd-1"
        p="x-4 y-2" @click="onBackup"
      >
        Backup
      </button>
    </div>
  </Dialog>
</template>

<style  scoped>
</style>
