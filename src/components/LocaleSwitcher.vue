<script setup lang="ts">
import { ref } from 'vue'
import PopDialog from '@/ui/PopDialog.vue'
import { setI18nLanguage } from '@/modules/i18n'

const show = ref<boolean>(false)

function cancelPopDialog() {
  show.value = false
}

function toggleShow() {
  show.value = !show.value
}

function changeToEN() {
  setI18nLanguage('en')
  cancelPopDialog()
}

function changeToCN() {
  setI18nLanguage('zhCN')
  cancelPopDialog()
}
</script>

<template>
  <button
    icon-button i-carbon-translate color-base text-6 p-0 b-0 style="line-height:38px;height: 38px;"
    @click="toggleShow"
  />

  <PopDialog :show="show" @on-cancel="cancelPopDialog">
    <ul class="color-base">
      <li class="hover-bg-base b-rd-2 flex flex-row" @click="changeToEN()">
        English
      </li>
      <li class="hover-bg-base b-rd-2 flex flex-row" @click="changeToCN()">
        简体中文
      </li>
    </ul>
  </PopDialog>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  transition: all .18s;
  padding: 8px 24px;
  cursor: pointer;
  margin-bottom: 6px;
}

li:last-child {
  margin-bottom: 0;
}
</style>
