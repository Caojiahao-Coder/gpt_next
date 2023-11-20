<script setup lang="ts">
import useOpenAIVisionStore from '@/store/openai-vision-store'
import UploadImageItem from '@/components/UploadImageItem.vue'

const openAIVisionStore = useOpenAIVisionStore()
</script>

<template>
  <div class="b-0 b-t-1 border-base b-solid color-base">
    <ul class="list-none p-0 m-0 bg-base">
      <UploadImageItem
        v-for="(item, index) in openAIVisionStore.fileList" :key="index" :file-name="item.fileName"
        :file-data="item.fileData" :index="index" class="b-0 b-solid border-base" :class="[
          index < openAIVisionStore.fileList.length - 1 ? 'b-b-1' : '',
        ]"
      />
    </ul>
  </div>
</template>
