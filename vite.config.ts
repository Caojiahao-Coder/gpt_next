import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

import UnoCSS from 'unocss/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      configFile: './uno.config.ts',
    }), VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname), './src/locales/**'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  logLevel: 'error',
})
