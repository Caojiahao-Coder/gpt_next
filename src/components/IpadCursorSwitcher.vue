<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PopDialog from '@/ui/PopDialog.vue'
import useIpadCursorStore from '@/store/ipad-cursor-store'
import Message from '@/ui/message'

const { t } = useI18n()

const show = ref<boolean>(false)

const ipadCursorStore = useIpadCursorStore()

function cancelPopDialog() {
  show.value = false
}

function toggleEnableIpadCursorAnimation() {
  ipadCursorStore.toggleEnableIpadCursorAnimation()
  Message.info(t('reload_page_to_see_change'))
}
</script>

<template>
  <button m-auto data-cursor="block" icon-button i-carbon-cursor-1 color-base text-6 p-0 b-0 h-38px line-height-38px
    @click="show = true" />

  <PopDialog :show="show" class="w-auto bottom-60px left-10px" @on-cancel="cancelPopDialog">
    <ul class="color-base">
      <div>
        {{ t('enable_ipad_cursor_animation') }}
      </div>
      <li data-cursor="block" class="hover-bg-base b-rd-2 flex flex-row" @click="toggleEnableIpadCursorAnimation()">
        {{
          ipadCursorStore.enable === true ? t('disable') : t('enable')
        }}
      </li>
    </ul>
  </PopDialog>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 8px 16px 8px;
  margin: 0;
}

li {
  transition: all .18s;
  margin-top: 16px;
  padding: 8px 24px;
  cursor: pointer;
  margin-bottom: 6px;
}

li:last-child {
  margin-bottom: 0;
}
</style>
