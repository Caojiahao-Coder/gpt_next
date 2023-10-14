import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics'
import { initCursor } from 'ipad-cursor'
import { createNotivue } from 'notivue'
import App from './App.vue'
import router from './router'
import { ipadCursortPlugin } from './utils/update-ipad-cursor'
import useIpadCursorStore from './store/ipad-cursor-store'
import { i18n } from '@/modules/i18n'

import '@/style/site.css'
import 'uno.css'
import 'notivue/notifications.css'
import 'notivue/animations.css'

inject()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

app.use(i18n)
app.use(router)

if (useIpadCursorStore().enable === true) {
  initCursor()
  app.use(ipadCursortPlugin)
}

export const push = createNotivue(app)
app.mount('#app')
