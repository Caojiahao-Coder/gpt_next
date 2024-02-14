<script setup lang="ts">
import { useI18n } from 'vue-i18n';


const {t}  = useI18n()
</script>

<template>
  <div class="color-base h-full text-center flex flex-col">
    <div class="flex-1" />
    <div>
      <div class="text-8">
        {{ t('underfine_conversation.title') }}
      </div>
      <div class="color-fade m-t-2">
        {{ t('underfine_conversation.desc') }}
      </div>
    </div>
    <div class="flex-1" />
  </div>
</template>
