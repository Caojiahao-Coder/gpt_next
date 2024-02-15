<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  functionName: string
  functionDescription: string
}>()

const { t } = useI18n()
</script>

<template>
  <div id="checking-view" class="b-1 border-base b-solid b-rd line-height-36px bg-base color-fade transition-all">
    <div class="flex flex-row line-height-32px">
      <div class="w-18px h-18px m-7px mr-8px i-svg-spinners-ring-resize" />
      <div class="h-32px">
        {{ t('waiting_for_function_calling_response') }}
      </div>
    </div>
    <div class="p-x-16px p-y-8px line-height-32px b-0 b-t-1 border-base b-solid ">
      <div>{{ t('functionCallingList.function_name') }}: {{ props.functionName }}</div>
      <div>{{ props.functionDescription }}</div>
    </div>
  </div>
</template>

<style scoped>
html.dark #checking-view{
  background: linear-gradient(251deg, rgba(174, 26, 26, 0.20) 0%, rgba(62, 8, 67, 0.11) 49.52%, rgba(27, 2, 35, 0.20) 100%), rgba(17, 17, 17, 0.90);
}

#checking-view{
  background: linear-gradient(112deg, rgba(155, 216, 228, 0.376) 33.17%, rgba(213, 179, 133, 0.20) 100%), linear-gradient(257deg, rgba(49, 89, 81, 0.20) 16.24%, rgba(181, 88, 70, 0.20) 73.46%), rgba(255, 255, 255, 0.90);
}
</style>
