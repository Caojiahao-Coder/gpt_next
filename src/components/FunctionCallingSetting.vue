<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FunctionCallingDetailView from '@/components/FunctionCallingDetailView.vue'
import type { ToolInfo } from '@/openai/tool-call'
import chatFunctionCallingController from '@/chat.function.calling/ChatFunctionCallingController'

const { t } = useI18n()

const toolsList = ref<ToolInfo[]>([])

const currentFunctionCallingInfo = ref<ToolInfo>()

const openFunctionCallingListDialog = ref<boolean>(false)
const fullScreen = ref<boolean>(false)
const selectedIndex = ref<number>(-1)

onMounted(() => {
  loadToolsList()
})

function loadToolsList() {
  toolsList.value = chatFunctionCallingController.getTools()
  if (toolsList.value.length > 0)
    currentFunctionCallingInfo.value = toolsList.value[0]
}

function toggleOpenFunctionCallingListDialog() {
  openFunctionCallingListDialog.value = !openFunctionCallingListDialog.value
}
function toggleFullScreen() {
  fullScreen.value = !fullScreen.value
}
function onCloseView() {
  openFunctionCallingListDialog.value = false
}
</script>

<template>
  <div class="border-base" b="0 b-1 solid">
    <div class="text-18px font-700 h-18px" p="t-16px l-16px r-16px">
      {{ t('function_calling_setting') }}
    </div>

    <div class="text-14px  h-18px color-gray" p="t-16px l-16px r-16px">
      {{ t('the_feature_only_for_gpt4') }}
    </div>

    <div class="flex flex-col gap-4 p-4">
      <button
        class="bg-body  color-base outline-none border-base hover-bg-base w-full transition-all px-4 py-2 b-1 b-solid border-base b-rd"
        @click="toggleOpenFunctionCallingListDialog"
      >
        {{ t('view_function_calling_list') }}
      </button>
    </div>

    <Transition>
      <div
        v-if="openFunctionCallingListDialog"
        class="fixed top-0 left-0 w-full h-100vh backdrop-blur z-100 flex-col flex color-base"
      >
        <div :class="[fullScreen ? 'h-16px' : 'h-20%']" class="transition-duration-.2s" @click="onCloseView" />
        <div class="flex flex-row overflow-hidden" :class="fullScreen ? 'h-100%' : 'h-600px'">
          <div :class="[fullScreen ? 'w-16px' : 'w-25%']" class="transition-duration-.2s" @click="onCloseView" />
          <div class="border-base b-rd b-1 b-solid bg-base flex-1 flex flex-col overflow-hidden flex-1">
            <div class="p-4 flex flex-row b-0 b-b-1 b-solid border-base">
              <div class="flex-1 text-5">
                {{ t('view_function_calling_list') }}
              </div>
              <div class="flex flex-row gap-2">
                <div
                  class="icon-button" :class="[
                    fullScreen ? 'i-carbon-minimize' : 'i-carbon-maximize',
                  ]" @click="toggleFullScreen"
                />

                <div class="icon-button i-carbon-close h-24px w-24px" @click="onCloseView" />
              </div>
            </div>

            <div class="flex flex-row flex-1 overflow-hidden h-full">
              <div class="w-300px b-0 b-r-1 b-solid border-base">
                <ul class="list-none p0 m0">
                  <li
                    v-for="(item, index) in toolsList" :key="index"
                    class="px4 py2 b-0 b-b-1 b-solid border-base cursor-pointer"
                    :class="[selectedIndex === index ? 'bg-body' : 'bg-base hover-bg-body']" @click="() => {
                      selectedIndex = index
                      currentFunctionCallingInfo = item
                    }"
                  >
                    {{ t(`functionCallingList.${item.function.name}`) }}
                  </li>
                </ul>
              </div>
              <div id="function_calling_detail" class="flex-1 h-full flex flex-col overflow-y-scroll">
                <FunctionCallingDetailView :function-calling-info="currentFunctionCallingInfo" />
              </div>
            </div>
          </div>
          <div :class="[fullScreen ? 'w-16px' : 'w-25%']" class="transition-duration-.2s" @click="onCloseView" />
        </div>
        <div :class="[fullScreen ? 'h-16px' : 'h-20%']" class="transition-duration-.2s" @click="onCloseView" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
#function_calling_detail::-webkit-scrollbar {
  width: 4px;
  border-left: 1px solid #33333380;
}

#function_calling_detail::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #50505050;
}
</style>
