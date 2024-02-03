<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { TBMessageInfo } from '@/database/table-type'

const props = defineProps<{
  messageInfo: TBMessageInfo
  loading: boolean
}>()

const showImgDialog = ref<boolean>(false)

const openFileName = ref<string>('')
const openFileData = ref<string>('')

const fileList = ref<{
  file_name: string
  b64_data: string
}[]>([])

const expand = ref<boolean>(true)

onMounted(() => {
  try {
    fileList.value = JSON.parse(props.messageInfo.vision_file ?? '') as {
      file_name: string
      b64_data: string
    }[]
  }
  catch {
    fileList.value = []
  }
})

function toggleExpand() {
  expand.value = !expand.value
}
</script>

<template>
  <div id="vision-list-view" class="b-1 border-solid border-base b-rd bg-base m-b-2">
    <div
      class="py-5px px-4 border-base border-solid flex flex-row select-none gap-2 bg-body b-rd-t"
      :class="[expand ? 'b-b-1 b-0' : 'b-0 b-rd']" @click="toggleExpand"
    >
      <div v-if="loading" class="m-3px i-svg-spinners-blocks-shuffle-3" />
      <div class="flex-1">
        GPT Vision List
      </div>
      <div
        class="w-22px h-22px" :class="[
          expand ? ' i-carbon-down i-carbon-chevron-up' : 'i-carbon-down i-carbon-chevron-down',
        ]"
      />
    </div>

    <div v-if="expand" class="flex flex-row gap-2 p-2 flex-wrap">
      <div
        v-for="(item, index) in fileList" :key="index"
        class="vision-img-item b-rd b-1 w-200px border-solid border-base h-130px overflow-hidden bg-cover bg-center bg-body relative"
        :style="{ backgroundImage: `url(${item.b64_data})` }"
      />
    </div>
  </div>
</template>

<style scoped>
#vision-list-view {
  background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%204096%204096%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22x37ws8lk43i60c%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221%22%20numOctaves%3D%222.8%22%20stitchTiles%3D%22stitch%22%20%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23x37ws8lk43i60c)%22%20opacity%3D%220.1%22%20%2F%3E%3C%2Fsvg%3E');
}

.img-item:hover>div {
  opacity: 1;
}

.img-item>div {
  opacity: 0;
}
</style>
