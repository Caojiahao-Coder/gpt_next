<script setup lang="ts">
import { useErrorDialogStore } from '@/store/errorDialog'

const errorDialogStore = useErrorDialogStore()

function onCancel() {
  const errorDialogStore = useErrorDialogStore()
  errorDialogStore.showErrorDialog = false
}
</script>

<template>
  <div
    v-if="errorDialogStore.showErrorDialog"
    class="error-dialog transition-all border-red absolute bg-red-2 left-0 bottom-0 color-red z-99999" p="6" b="1px solid"
    style="width:calc(100% - 50px);"
  >
    <div class="font-bold">
      Error.
    </div>
    <div class="flex flex-row m-t-2">
      <div class="flex-1 min-h-34px" style="line-height: 34px;">
        {{ errorDialogStore.message }}
      </div>
      <div>
        <button class="bg-red border-red-5 color-white outline-none " p="x-4 y-2" b="1 solid rd-1" @click="onCancel">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-dialog {
  animation: identifier ease .36s;
}

@keyframes identifier {
  0% {
    max-height: 0px;
  }

  100% {
    max-height: 400px;
  }
}
</style>
