<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  desc?: string
  icon: string
}>(), {
  desc: '',
})
</script>

<template>
  <div class="bg-root">
    <div class="card-root p-6 border-base b-1 b-rd b-solid relative">
      <div bg-body inline-block p-3 b-rd-2>
        <div :class="icon" text-32px />
      </div>
      <div class="color-base font-bold text-32px m-t-5">
        {{ title }}
      </div>
      <div text-5 line-height-32px m-t-4 color-fade>
        {{ desc }}
        <slot />
      </div>
    </div>
    <div
      w-48px h-48px absolute bg-blue-7 blur-76px top-2rem left-2rem
    />
  </div>
</template>

<style scoped>
.card-root {
  background-image: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22yr87u7lkncose4%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221%22%20numOctaves%3D%2210%22%20stitchTiles%3D%22stitch%22%20%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23yr87u7lkncose4)%22%20opacity%3D%220.08%22%20%2F%3E%3C%2Fsvg%3E');
}

.bg-root {
  position: relative;
  overflow: hidden;
}
</style>
