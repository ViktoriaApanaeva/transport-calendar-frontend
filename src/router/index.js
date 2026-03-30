import { createRouter, createWebHistory } from 'vue-router'
import CalendarView from '../views/CalendarView.vue'

const routes = [
  { path: '/', redirect: '/calendar' },
  { path: '/calendar', component: CalendarView },
  { path: '/about', component: () => import('../views/AboutView.vue') },
  { path: '/help', component: () => import('../views/HelpView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router