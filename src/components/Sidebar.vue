<template>
  <div v-if="mobileOpen" class="fixed inset-0 z-40 lg:hidden" style="background: rgba(0,0,0,0.3);" @click="$emit('close')"></div>

  <aside
    class="fixed left-0 top-0 z-50 h-screen flex flex-col py-6 transition-transform duration-300 lg:translate-x-0"
    :class="mobileOpen ? 'w-[260px] translate-x-0' : 'w-[260px] -translate-x-full lg:w-[260px] lg:translate-x-0'"
    style="background: #ffffff; border-right: 1px solid #e2e8f0; box-shadow: 4px 0 20px rgba(0,0,0,0.04);"
  >
    <div class="px-6 mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          <span class="text-gradient">MediaAI</span>
        </h1>
        <p class="text-xs mt-0.5" style="color: #94a3b8;">Downloader Pintar</p>
      </div>
      <button @click="$emit('close')" class="lg:hidden p-1 transition-colors" style="color: #94a3b8;">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>

    <nav class="flex-1 px-3 space-y-0.5">
      <a v-for="item in navItems" :key="item.path"
        @click.prevent="navigate(item.path)"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm cursor-pointer"
        :class="isActive(item.path)
          ? 'font-semibold'
          : 'hover:bg-surface-hover'"
        :style="isActive(item.path)
          ? 'background: rgba(239,68,68,0.08); color: #dc2626; border-left: 2px solid #ef4444;'
          : 'color: #475569;'"
      >
        <span class="material-symbols-outlined text-xl" :style="isActive(item.path) ? 'font-variation-settings: \'FILL\' 1; color: #ef4444;' : ''">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </a>
    </nav>

    <div class="px-6 mb-4">
      <a @click.prevent="navigate('/chat')" class="w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm cursor-pointer transition-all text-white" style="background: linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%); box-shadow: 0 4px 15px rgba(239,68,68,0.25);">
        <span class="material-symbols-outlined text-lg">add</span>
        <span class="hidden sm:inline">Download Baru</span>
      </a>
    </div>

    <div class="px-3 pt-4 space-y-0.5" style="border-top: 1px solid #e2e8f0;">
      <div class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm" style="color: #94a3b8;">
        <span class="material-symbols-outlined text-xl">help</span>
        <span>Bantuan</span>
      </div>
      <div @click="handleLogout" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-colors" style="color: #64748b;">
        <span class="material-symbols-outlined text-xl">logout</span>
        <span>Keluar</span>
      </div>
    </div>
  </aside>

  <nav class="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden pb-safe pt-1" style="background: #ffffff; border-top: 1px solid #e2e8f0; padding-bottom: max(env(safe-area-inset-bottom, 0px), 4px);">
    <a v-for="item in navItems" :key="item.path"
      @click.prevent="navigate(item.path)"
      class="flex-1 flex flex-col items-center gap-0.5 py-1.5 transition-colors text-[10px] cursor-pointer"
      :class="isActive(item.path) ? 'text-accent' : ''" :style="isActive(item.path) ? 'color: #ef4444;' : 'color: #94a3b8;'"
    >
      <span class="material-symbols-outlined text-xl" :style="isActive(item.path) ? 'font-variation-settings: \'FILL\' 1' : ''">{{ item.icon }}</span>
      <span class="truncate max-w-[60px] text-center">{{ item.short }}</span>
    </a>
    <button @click="$emit('toggle')" class="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-[10px]" style="color: #94a3b8;">
      <span class="material-symbols-outlined text-xl">menu</span>
      <span>Menu</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useConfirm } from '@/composables/useConfirm'

defineProps<{ mobileOpen: boolean }>()
const emit = defineEmits<{ toggle: []; close: [] }>()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const confirm = useConfirm()

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Dasbor', short: 'Dasbor' },
  { path: '/chat', icon: 'smart_toy', label: 'AI Download', short: 'AI' },
  { path: '/library', icon: 'video_library', label: 'Perpustakaan', short: 'Media' },
  { path: '/settings', icon: 'settings', label: 'Pengaturan', short: 'Set' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function navigate(path: string) { router.push(path); emit('close') }

async function handleLogout() {
  const ok = await confirm.confirm({
    title: 'Keluar',
    message: 'Apakah Anda yakin ingin keluar?',
    icon: 'logout',
    confirmText: 'Keluar',
    confirmBg: 'linear-gradient(135deg, #ef4444, #f97316)',
  })
  if (ok) { await auth.logout(); router.push('/login') }
}
</script>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
.bg-surface-hover { background: #f1f5f9; }
</style>
