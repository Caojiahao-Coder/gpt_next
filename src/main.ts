import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics'
import App from './App.vue'
import router from './router'

import { i18n } from '@/modules/i18n'

import '@/style/site.css'
import 'uno.css'

inject()

const app = createApp(App)
const pinia = createPinia()

app.use(i18n)
app.use(router)
app.use(pinia)
app.mount('#app')
