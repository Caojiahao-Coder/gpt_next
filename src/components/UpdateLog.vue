<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import confetti from 'canvas-confetti'
import { useI18n } from 'vue-i18n'
import config from '../../package.json'
import Markdown from './Markdown.vue'
import Dialog from '@/ui/Dialog.vue'
import UpdateHistory from '@/assets/update-history'
import { versionCode } from '@/store/localstorage'

const props = defineProps<{
  openDialog: boolean
}>()

const event = defineEmits(['onClose'])

const { t } = useI18n()

const open = ref<boolean>(props.openDialog)

const lang = ref<string>(window.localStorage.getItem('lang') ?? 'en')

watch(() => props.openDialog, (newValue, _) => {
  open.value = newValue
})

const updateInfo = UpdateHistory.filter(a => a.status === 'active')[0]

onMounted(() => {
  open.value = (versionCode.value !== updateInfo.code)

  versionCode.value = updateInfo.code

  if (open.value === true) {
    const end = Date.now() + 300

    const colors = ['#f5222d', '#fa541c', '#ffec3d', '#13c2c2', '#52c41a', '#1677ff', '#2f54eb', '#722ed1', '#eb2f96'];

    (function frame() {
      confetti({
        particleCount: colors.length,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: colors.length,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })

      if (Date.now() < end)
        requestAnimationFrame(frame)
    }())
  }
})

function onCloseUpdateHistoryDialog() {
  open.value = false
  event('onClose')
}
</script>

<template>
  <div>
    <Dialog
      :title="
        lang === 'en' ? `${t('updateLog.title')} V${config.version}` : `V${config.version}${t('updateLog.title')}`
      " :open="open" default-full-screen @on-close="onCloseUpdateHistoryDialog"
    >
      <div class="flex flex-row">
        <div class="flex-1" />
        <div class="max-w-1600px min-w-600px">
          <Markdown
            :content="lang === 'en' ? updateInfo.content : updateInfo.content_cn"
          />
        </div>
        <div class="flex-1" />
      </div>
    </Dialog>
  </div>
</template>
