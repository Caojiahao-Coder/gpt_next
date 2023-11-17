<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import useOpenAIVisionStore from '@/store/openai-vision-store'
import PopDialog from '@/ui/PopDialog.vue'

const props = defineProps<{
  index: number
  fileName: string
  fileData: string
}>()

const openAIVisionStore = useOpenAIVisionStore()

const { t } = useI18n()

const show = ref<boolean>(false)
</script>

<template>
  <div class="relative">
    <li class="flex flex-row gap-2 px-4 py-2 bg-green-1 color-dark cursor-pointer" @mouseenter="show = true">
      <div class="flex-1">
        {{ props.fileName }}
      </div>
      <div class="hover-color-red h-22px w-22px cursor-pointer i-carbon-close" @click="openAIVisionStore.deleteFileByIndex(index)" />
    </li>
    <PopDialog :show="show" class="absolute bottom-32px left-16px" @on-cancel="show = false">
      <div class="w-200px h-120px bg-cover bg-center b-rd" :style="{ backgroundImage: `url(${props.fileData})` }" />
    </PopDialog>
  </div>
</template>
