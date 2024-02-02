<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

defineProps<{
  functionName: string
  functionDescription: string
}>()

const { t } = useI18n()

const showFunctionDetail = ref<boolean>(false)

function toggleShowFunctionDetail() {
  showFunctionDetail.value = !showFunctionDetail.value
}
</script>

<template>
  <div id="checking-view" class="b-1 border-base b-solid b-rd  bg-base color-fade transition-all mb1 select-none">
    <div class="flex flex-row line-height-32px" @click="toggleShowFunctionDetail">
      <div class="w-24px h-24px m-4px mr-8px i-carbon-information-square-filled" />
      <div class="flex-1">
        {{ t('mark_function_calling_hint') }}
      </div>
      <div
        class="w-16px h-16px m-8px mr-8px" :class="[
          showFunctionDetail ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down',
        ]"
      />
    </div>

    <div v-if="showFunctionDetail" class="b-0 b-t-1 b-solid border-base px-4 py-2 transition-all">
      <div class="line-height-32px">
        {{ t('functionCallingList.function_name') }}: {{ functionName }}
      </div>
      <div class="line-height-32px">
        {{ t('functionCallingList.function_description') }}: {{ functionDescription }}
      </div>
    </div>
  </div>
</template>

<style scoped>
html.dark #checking-view {
  background: linear-gradient(251deg, rgba(174, 26, 26, 0.20) 0%, rgba(62, 8, 67, 0.11) 49.52%, rgba(27, 2, 35, 0.20) 100%), rgba(17, 17, 17, 0.90);
}

#checking-view {
  background: linear-gradient(112deg, rgba(155, 216, 228, 0.376) 33.17%, rgba(213, 179, 133, 0.20) 100%), linear-gradient(257deg, rgba(49, 89, 81, 0.20) 16.24%, rgba(181, 88, 70, 0.20) 73.46%), rgba(255, 255, 255, 0.90);
}
</style>
