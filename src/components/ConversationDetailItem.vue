<script setup lang="ts">
const props = defineProps<{
  role: 'user' | 'gpt'
}>()
</script>

<template>
  <div
    class="p-6 border-base flex flex-row" b="0 b-1 solid" :class="[
      props.role === 'user' ? 'bg-base' : 'bg-body',
      props.role,
    ]"
  >
    <div class="avatar w-8 h-8 b-rd-1">
      <div class="w-18px h-18px i-carbon-user-filled m-7px color-white" />
    </div>
    <div class="flex-1 m-l-16px conversation-content">
      Hello ChatGPT.
    </div>
  </div>
</template>

<style scoped>
.user>.avatar {
  background-color: #33333380;
}

.gpt>.avatar {
  background: linear-gradient(135deg, #10E8C1 0%, #00FF66 100%);
}

.conversation-content
{
  line-height: 32px;
  overflow: hidden;
  word-wrap: break-word;
}
</style>
