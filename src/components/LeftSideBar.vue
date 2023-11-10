<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { uid } from 'uid'
import config from '../../package.json'
import ConversationsList from './ConversationsList.vue'
import { useLeftSideBarStore } from '@/store/leftsidebar'
import useConversationStore from '@/store/conversation-store'
import useMessageStore from '@/store/message-store'
import { filterType } from '@/store/localstorage'

const { t } = useI18n()
const { width } = useWindowSize()

const expandStore = useLeftSideBarStore()

const showFilterMenu = ref<boolean>(false)

watch(width, (newValue) => {
  expandStore.expand = (newValue >= 800)
})

function onCloseLeftSideBar() {
  expandStore.expand = false
}

function onCreateNewConversation() {
  const messageStore = useMessageStore()
  messageStore.messageList = []
  const conversationStore = useConversationStore()
  conversationStore.createNewConversation({
    title: t('new_conversation_title'),
    color: 'bg-gray',
    create_time: Date.now(),
    description: '',
    conversation_token: uid(32),
    type: 'chat',
  })
}

onMounted(() => {
  document.getElementById('move-item')!.addEventListener('mousedown', (e: MouseEvent) => {
    const startX = e.clientX
    const startWidth = document.getElementById('left-menu')!.offsetWidth
    document.onmousemove = function (e) {
      const moveX = e.clientX
      const diffX = moveX - startX
      document.getElementById('left-menu')!.style.width = `${startWidth + diffX}px`
    }
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null
    }
  })

  window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('filter-type-view')?.firstChild)
      return

    if (showFilterMenu.value === true)
      showFilterMenu.value = false
  })
})

function toggleFilterMenu() {
  showFilterMenu.value = !showFilterMenu.value
}

function selectFilterType(type: 'all' | 'chat' | 'data' | 'drawing') {
  filterType.value = type
  toggleFilterMenu()
}
</script>

<template>
  <div
    id="left-menu" class="flex flex-row min-w-300px max-w-600px" :style="{
      minWidth: expandStore.expand === true ? '300px' : '0px',
      width: expandStore.expand === false ? '0px' : '300px',
    }"
  >
    <div
      :style="{
        width: expandStore.expand === true ? 'calc(100% - 1px)' : '0px',
      }" class="transition-all h-100vh bg-base flex-shrink-0 flex flex-col color-base overflow-hidden"
    >
      <div class="h-47px p-16px border-base" b="0 b-1 solid">
        <div class="flex flex-rows line-height-47px">
          <div class="flex-1 text-6 font-bold select-none">
            {{ t('conversation') }}
          </div>
          <div
            data-cursor="block" i-carbon-add-comment class="text-6 icon-button" m="y-12px"
            @click="onCreateNewConversation"
          />
          <div
            v-if="width <= 800" i-carbon-close class="text-6 icon-button m-l-2" m="y-12px "
            @click="onCloseLeftSideBar"
          />
        </div>
      </div>

      <div>
        <div id="filter-type-view" class="p-2 b-0 b-b-1 border-base b-solid relative">
          <div
            class="b-1 b-solid border-base p2 bg-base flex flex-row gap-2 " :class="[
              showFilterMenu ? 'b-rd-tl b-rd-tr bg-body' : 'b-rd hover-bg-body',
            ]" @click="toggleFilterMenu"
          >
            <div class="i-carbon-filter text-5" />
            <div>
              {{ t(`filter_type_${filterType}`) }}
            </div>
          </div>

          <div
            v-if="showFilterMenu"
            class="z-1000 top-40px bg-body b-rd-br b-rd-bl b-0 border-solid border-base b-b-1 b-l-1 b-r-1 overflow-hidden"
          >
            <ul class="m-0 list-none p-0">
              <li class="py-2 px-4 cursor-pointer bg-base hover-bg-body" @click="selectFilterType('all')">
                {{ t('filter_type_all') }}
              </li>
              <li class="py-2 px-4 cursor-pointer bg-base hover-bg-body" @click="selectFilterType('chat')">
                {{ t('filter_type_chat') }}
              </li>
              <li class="py-2 px-4 cursor-pointer bg-base hover-bg-body" @click="selectFilterType('data')">
                {{ t('filter_type_data') }}
              </li>
              <li class="py-2 px-4 cursor-pointer bg-base hover-bg-body" @click="selectFilterType('drawing')">
                {{ t('filter_type_drawing') }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ConversationsList />

      <div class="flex flex-row h-47px text-3 border-base select-none color-fade" p="16px" b="0 t-1 solid">
        <div line-height-47px>
          <span>
            Designed By
          </span>
          <a
            class="decoration-dashed color-base hover-color-primary color-fade"
            href="https://github.com/Caojiahao-Coder"
          >Leo
            Cao</a>.
        </div>

        <div flex-1 />

        <a
          href="https://leocao-me.vercel.app/gpt_next-updatelogs"
          class="text-right color-base flex flex-row gap-1 icon-button cursor-pointer"
        >
          <div i-carbon-campsite class="text-16px h-24px" />
          <div class="text-12px color-base line-height-24px">
            {{ config.version }}
          </div>
        </a>
      </div>
    </div>
    <div v-show="expandStore.expand === true" id="left_menu_move_bar" class="h-100vh border-base" b="r-1 solid 0">
      <div id="move-item">
        <div
          data-cursor="block"
          class="i-carbon-property-relationship icon-button transition-all text-4 m-auto color-base line-height-24px h-24px cursor-col-resize "
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
#left_menu_move_bar {
  position: relative;
  user-select: none;
}

html.dark #move-item {
  background-color: rgb(51, 51, 51);
}

#move-item {
  content: "";
  width: 24px;
  height: 24px;
  background-color: rgb(191, 194, 198);
  position: absolute;
  left: -12px;
  bottom: 140px;
  z-index: 1;
  border-radius: 90px;
  border: 1px solid rgb(191, 194, 198);
  opacity: .2;
  user-select: none;
}

#move-item:hover {
  border: 1px solid rgba(147, 197, 253, 30);
  opacity: 1;
}
</style>
