import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import LibraryView from '@/views/LibraryView.vue'
import ChatView from '@/views/ChatView.vue'
import PlayerView from '@/views/PlayerView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { noAuth: true } },
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/library', name: 'library', component: LibraryView },
  { path: '/library/:id', name: 'player', component: PlayerView },
  { path: '/chat', name: 'chat', component: ChatView },
  { path: '/settings', name: 'settings', component: SettingsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.noAuth) return next()
  if (!token) return next('/login')
  next()
})

export default router
