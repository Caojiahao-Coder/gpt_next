<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  show: boolean
}>()

const emits = defineEmits([
  'onReload', 'onEdit', 'onDelete',
])

const { t } = useI18n()
</script>

<template>
  <div
    v-if="props.show" class="message-tools flex flex-row absolute border-base bg-base p-x-2 p-y-1 gap-1"
    b="2 solid rd-5"
  >
    <div
      i-carbon-restart icon-button class="w-4 h-4 color-base" :title="t('reload')" @click="() => {
        emits('onReload')
      }"
    />
    <div class="w-1px h-2 m-y-1 border-base" b="0 solid l-1" />
    <div
      i-carbon-edit icon-button class="w-4 h-4 color-base" :title="t('edit')" @click="() => {
        emits('onEdit')
      }"
    />
    <div class="w-1px h-2 m-y-1 border-base" b="0 solid l-1" />
    <div
      i-carbon-trash-can icon-button class="w-4 h-4 color-base" :title="t('delete')" @click="() => {
        emits('onDelete')
      }"
    />
  </div>
</template>

<style scoped>
.message-tools {
  transition: all .18s;
  animation: identifier ease .18s;
}

.message-tools:hover {
  box-shadow: 1px 2px 8px #00ffb330, -1px -2px 8px #00a2ff30;
}

@keyframes identifier {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
