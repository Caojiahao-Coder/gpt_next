<script setup lang="ts">
import { useErrorDialogStore } from '@/store/errorDialog'

const errorDialogStore = useErrorDialogStore()

function onCancel() {
  const errorDialogStore = useErrorDialogStore()
  errorDialogStore.showErrorDialog = false
}
</script>

<template>
  <Transition name="expand">
    <div
      v-if="errorDialogStore.showErrorDialog" class="transition-all border-red bg-red-1 color-red z-99999 overflow-hidden" p="6"
      b="0 t-1 solid"
    >
      <div class="font-bold">
        Error.
      </div>
      <div class="flex flex-row m-t-2">
        <div class="flex-1 flex flex-row gap-2">
          <div class="flex flex-col">
            <div class="flex-1" />
            <div i-carbon-information />
            <div class="flex-1" />
          </div>
          <div class="flex flex-col">
            <div class="flex-1" />
            <div> {{ errorDialogStore.message }}</div>
            <div class="flex-1" />
          </div>
        </div>
        <div>
          <button class="bg-red border-red-5 color-white outline-none " p="x-4 y-2" b="1 solid rd-1" @click="onCancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.expand-enter-from {
  max-height: 0px;
}

.expand-enter-active {
  transition: all .36s;
}

.expand-leave-active
{
  transition: opacity .12s;
}

.expand-enter-to{
  max-height: 280px;
}

.expand-leave-to
{
  opacity: 0;
}
</style>
