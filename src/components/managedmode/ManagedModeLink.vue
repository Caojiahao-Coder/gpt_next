<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <a href="/managed/#" style="text-decoration: none;">
    <div class="main-bg m-3 rd-4 text-5 bg-body p-x-4 p-y-4 text-center cursor-pointer color-light relative select-none hover-bg-blue transition-all">
      {{ t('managed_mode') }}
      <div class="new-bg absolute right--6px top--12px bg-red b-rd-2 p-1 text-3">
        New
      </div>
    </div>
  </a>
</template>

<style scoped>
.new-bg {
  background: linear-gradient(90deg, rgba(247, 0, 208, 0.89) 0%, #9747FF 100%);
  transform: rotateZ(15deg);
}
</style>
