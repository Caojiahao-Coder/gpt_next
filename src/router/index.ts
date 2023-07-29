import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import ManagedModeWelcomePage from '@/pages/ManagedModeWelcomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/managed',
      name: 'managed',
      component: ManagedModeWelcomePage,
    },
  ],
})

export default router
