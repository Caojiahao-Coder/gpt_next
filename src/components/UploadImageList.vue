<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import useOpenAIVisionStore from '@/store/openai-vision-store'
import UploadImageItem from '@/components/UploadImageItem.vue'

const openAIVisionStore = useOpenAIVisionStore()

const { t } = useI18n()
</script>

<template>
  <div class="b-0 b-t-1 border-base b-solid color-base">
    <ul class="list-none p-0 m-0">
      <UploadImageItem v-for="(item, index) in openAIVisionStore.fileList" :key="index" :file-name="item.fileName" :file-data="item.fileData" :index="index" />
    </ul>
  </div>
</template>
