<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ViewHeader from '@/components/managedmode/ViewHeader.vue'
import MainCard from '@/components/managedmode/MainCard.vue'
import Message from '@/ui/message'

const { t } = useI18n()

function onClickLogin() {
  Message.info('托管模式正在开发中，敬请期待')
}
</script>

<template>
  <ViewHeader />

  <main style="height: calc(100vh - 81px);overflow: scroll;">
    <div id="content_1_bg" class="relative">
      <div id="content_1" class="max-w-1200px m-auto p-2 color-base h-100%">
        <div>
          <div class="h-200px" />
          <h1 class="text-center text-shadow text-18 relative">
            GPT - NEXT Managed Mode
            <span class="new-label text-4 absolute border-base b-1 b-solid b-rd-2 p-x-2 p-y-1 m-l--4">
              {{ t('developing') }}
            </span>
          </h1>
          <div class="font-bold text-32px text-center line-height-50px">
            {{ t('managed_mode_title_1') }}
            <br>
            {{ t('managed_mode_title_2') }}
          </div>
          <div class="h-360px text-center">
            <button
              b-rd-9 color-light bg-blue outline-none b-0 p-x-8 p-y-4 m-t-40px text-5 font-bold hover-bg-blue-6
              transition-all @click="onClickLogin"
            >
              {{ t('login_start') }}
            </button>
            <div text-center m-t-40px>
              <a
                href="/managed/#plan" color-base decoration-none b-b-1 b-dashed b-0 p-b-1 border-base transition-all
                hover:border-blue-5
              >
                {{ t('view_pricing_plan') }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-bar" />
    </div>

    <div id="content_2_bg" class="p-y-32px">
      <div id="content_2" class="max-w-1200px m-auto p-2 color-base h-100% grid grid-cols-2 gap-4">
        <MainCard
          :title="t('secure')" icon="i-carbon-manage-protection"
          :desc="t('secure_desc')"
        />

        <MainCard
          :title="t('persistent_session_mode')" icon="i-carbon-ibm-cloud-event-notification"
          :desc="t('persistent_session_mode_desc')"
        />

        <MainCard
          :title="t('multiple_roles')" icon="i-carbon-user-simulation"
          :desc="t('multiple_roles_desc')"
        />
      </div>
    </div>

    <div id="content_3_bg">
      <div id="plan" class="max-w-1200px m-auto p-2 color-base">
        <h1>{{ t('placing_plan') }}</h1>
        <div class="m-t-64px grid grid-cols-2 gap-24px">
          <MainCard :title="t('free')" icon="i-carbon-military-camp">
            <div>
              <div line-height-48px h-48px text-6 font-bold>
                {{ t('free_price') }}
              </div>

              <ul p-0 m-0 list-none>
                <li flex flex-row gap-16px>
                  <div i-carbon-checkmark line-height-36px h-36px color-green />
                  {{ t('free_token') }}
                </li>
                <li flex flex-row gap-16px>
                  <div i-carbon-checkmark line-height-36px h-36px color-green />
                  {{ t('supports_chatglm') }}
                </li>
              </ul>
            </div>
          </MainCard>
          <MainCard title="Standard" icon="i-carbon-bot">
            <div>
              <div line-height-48px h-48px text-6 font-bold>
                {{ t('standard_price') }}
              </div>

              <ul p-0 m-0 list-none>
                <li flex flex-row gap-16px>
                  <div i-carbon-checkmark line-height-36px h-36px color-green />
                  每月最多40000个Token
                </li>
                <li flex flex-row gap-16px>
                  <div i-carbon-close line-height-36px h-36px color-red />
                  {{ t('supports_chatglm') }}
                </li>
              </ul>
            </div>
          </MainCard>
          <MainCard title="Pro" icon="i-carbon-flash-filled">
            <div>
              <div line-height-48px h-48px text-6 font-bold color-yellow>
                {{ t('pro_price') }}
              </div>
              <ul p-0 m-0 list-none>
                <li flex flex-row gap-16px>
                  <div i-carbon-checkmark line-height-36px h-36px color-green />
                  {{ t('pro_token') }}
                </li>
                <li flex flex-row gap-16px>
                  <div i-carbon-checkmark line-height-36px h-36px text-5 color-green />
                  {{ t('supports_chatglm') }}
                </li>
              </ul>
            </div>
          </MainCard>
        </div>
      </div>
    </div>

    <div p-12 text-center bg-body m-t-4 color-base>
      Designed by LeoCao © 2023
    </div>
  </main>
</template>

<style scoped>
main::-webkit-scrollbar {
  display: none;
}

#content_1_bg {
  background-size: 100px;
  background-image: url(../assets/managedmode/content_1_bg.svg);
}

html.dark .bottom-bar {
  position: absolute;
  height: 100px;
  width: 100%;
  bottom: 0;
  left: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
}

.bottom-bar {
  position: absolute;
  height: 100px;
  width: 100%;
  bottom: 0;
  left: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #ffffff 100%);
}

.new-label {
  background: linear-gradient(90deg, rgba(247, 0, 208, 0.89) 0%, #9747FF 100%);
  -webkit-background-clip: text;
  color: transparent;
  transform: rotateZ(18deg);
}

#content_1 h1 {
  background-image: url(../assets/managedmode/title_bg_bar.svg);
  -webkit-background-clip: text;
  color: transparent;
  animation: identifier 50s ease infinite;
  user-select: none;
}

@keyframes identifier {
  0% {
    background-position: 0%;
  }

  50% {
    background-position: 100%;
  }

  100% {
    background-position: 0%;
  }
}

ul>li {
  line-height: 36px;
}

ul {
  margin-top: 16px;
}
</style>
