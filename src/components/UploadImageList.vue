<script setup lang="ts">
import UploadImageItem from '@/components/UploadImageItem.vue'

const props = defineProps<{
  visionFileList: {
    fileName: string
    b64Data: string
  }[]
}>()

const events = defineEmits([
  'deleteFileByIndex',
])
</script>

<template>
  <div
    class="color-base" :class="[
      props.visionFileList.length > 0 ? 'b-0 b-b-1 b-solid border-base b-rd' : '',
    ]"
  >
    <ul class="list-none p-0 m-0 bg-base">
      <UploadImageItem
        v-for="(item, index) in props.visionFileList" :key="index" :file-name="item.fileName"
        :file-data="item.b64Data" :index="index" class="b-0 b-solid border-base" :class="[
          index < props.visionFileList.length - 1 ? 'b-b-1' : '',
        ]"
        @delete-file-by-index="(index) => events('deleteFileByIndex', index)"
      />
    </ul>
  </div>
</template>
