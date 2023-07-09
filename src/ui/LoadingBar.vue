<script setup lang="ts">
import useEditorStore from '@/store/editor-store'

const editorStore = useEditorStore()
</script>

<template>
  <div>
    <div v-if="editorStore.thinking" class="loading-bar" h-1px border-base b="0 b-1 solid" />
    <div v-else border-base b-t-1 b-0 b-solid />
  </div>
</template>

<style scoped>
.loading-bar {
  position: relative;
  background: linear-gradient(90deg, rgba(247, 0, 208, 0.89) 0%, #9747FF 100%);
  overflow: hidden;
}

.loading-bar::after {
  content: "";
  position: absolute;
  height: 64px;
  width: 60%;
  background-color: rgba(239, 247, 0, 0.6);
  filter: blur(.6rem);
  top: -28px;
  left: -60%;
  animation: identifier ease 1.6s infinite;
}

@keyframes identifier {
  from {
    left: -60%;
  }

  to {
    left: 100%;
  }
}
</style>
