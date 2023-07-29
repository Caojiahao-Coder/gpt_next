<script setup lang="ts">
import DarkSwitcher from '@/components/DarkSwitcher.vue'
import LocaleSwitcher from '@/components/managedmode/LocaleSwitcher.vue'
import IpadCursorSwitcher from '@/components/IpadCursorSwitcher.vue'
</script>

<template>
  <div id="common-slide" class="h-47px p-16px grid grid-cols-3 border-base" b="0 t-1 solid">
    <DarkSwitcher />
    <IpadCursorSwitcher />
    <LocaleSwitcher />
  </div>
</template>
