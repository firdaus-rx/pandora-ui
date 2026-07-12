<template>
  <header class="fixed top-0 right-0 z-30 flex items-center h-14 lg:h-16 transition-all"
    :class="isAuthPage ? '' : 'lg:w-[calc(100%-260px)] w-full'"
    style="background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid #e2e8f0;"
  >
    <div class="flex items-center gap-2 lg:gap-4 px-3 lg:px-6 w-full">
      <button @click="$emit('toggleMenu')" class="lg:hidden -ml-1 p-1 transition-colors" style="color: #64748b;">
        <span class="material-symbols-outlined text-2xl">menu</span>
      </button>

      <div class="relative flex-1 max-w-xs lg:max-w-sm">
        <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-base lg:text-lg pointer-events-none" style="color: #94a3b8;">search</span>
        <input v-model="searchQuery" @input="onSearchInput" @keyup.enter="handleSearch"
          class="w-full rounded-full py-2 lg:py-2.5 pl-10 lg:pl-11 pr-9 text-sm outline-none transition-all"
          placeholder="Cari media..." type="text"
          style="background: #f1f5f9; border: 1px solid transparent; color: #0f172a;"
          @focus="e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.08)'; }"
          @blur="e => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; }"
        />
        <button v-if="searchQuery" @click="clearSearch" class="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style="color: #94a3b8;">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div class="flex items-center gap-1 lg:gap-3 ml-auto">
        <div class="hidden md:flex items-center gap-1 lg:gap-2 mr-2 lg:mr-4">
          <a @click="openDocs" class="px-2 lg:px-3 py-1.5 text-xs lg:text-sm rounded-lg transition-all cursor-pointer" style="color: #64748b;">Dokumen</a>
          <a @click="openAPI" class="px-2 lg:px-3 py-1.5 text-xs lg:text-sm rounded-lg transition-all cursor-pointer" style="color: #64748b;">API</a>
        </div>

        <div class="relative">
          <button @click="notifOpen = !notifOpen" class="relative p-2 transition-colors hidden sm:block" style="color: #94a3b8;">
            <span class="material-symbols-outlined text-xl lg:text-2xl">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style="background: #ef4444;"></span>
          </button>
          <div v-if="notifOpen" class="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden z-50" style="background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.08);" @click.outside="notifOpen = false">
            <div class="px-5 py-3.5 font-semibold text-sm" style="border-bottom: 1px solid #f1f5f9; color: #0f172a;">Notifikasi</div>
            <div class="p-4 text-xs text-center" style="color: #94a3b8;">Tidak ada notifikasi baru</div>
          </div>
        </div>

        <div class="relative flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 ml-1 lg:ml-2 cursor-pointer" style="border-left: 1px solid #e2e8f0;" @click="profileOpen = !profileOpen">
          <div class="hidden lg:block text-right">
            <p class="text-xs font-medium leading-tight" style="color: #0f172a;">{{ auth.user }}</p>
            <p class="text-[10px] font-mono" style="color: #8b5cf6;">PRO</p>
          </div>
          <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105" style="background: linear-gradient(135deg, #fecaca, #ede9fe); border: 1px solid #fca5a5;">
            <span class="text-xs font-bold" style="color: #dc2626;">{{ initials }}</span>
          </div>
        </div>

        <div v-if="profileOpen" class="absolute right-3 lg:right-6 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50" style="background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.08);" @click.outside="profileOpen = false">
          <div class="px-5 py-4 flex items-center gap-3" style="border-bottom: 1px solid #f1f5f9;">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold" style="background: linear-gradient(135deg, #fecaca, #ede9fe); color: #dc2626;">{{ initials }}</div>
            <div>
              <p class="text-sm font-semibold" style="color: #0f172a;">{{ auth.user }}</p>
              <p class="text-[11px] font-mono" style="color: #8b5cf6;">PRO MEMBER</p>
            </div>
          </div>
          <div class="p-2">
            <a @click="profileOpen = false; router.push('/settings')" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer" style="color: #475569;">
              <span class="material-symbols-outlined text-lg">settings</span> Pengaturan
            </a>
            <a @click="handleLogout" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer" style="color: #ef4444;">
              <span class="material-symbols-outlined text-lg">logout</span> Keluar
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useConfirm } from '@/composables/useConfirm'

defineEmits<{ toggleMenu: [] }>()
const router = useRouter()
const auth = useAuthStore()
const confirm = useConfirm()
const searchQuery = ref('')
const notifOpen = ref(false)
const profileOpen = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const isAuthPage = computed(() => router.currentRoute.value.meta.noAuth)
const initials = computed(() => auth.user?.charAt(0).toUpperCase() || 'A')

function onSearchInput() { if (debounceTimer) clearTimeout(debounceTimer); debounceTimer = setTimeout(handleSearch, 400) }
function handleSearch() {
  if (searchQuery.value.trim()) router.push({ path: '/library', query: { q: searchQuery.value.trim() } })
  else if (!searchQuery.value.trim() && router.currentRoute.value.path === '/library') router.push({ path: '/library', query: {} })
}
function clearSearch() { searchQuery.value = ''; if (router.currentRoute.value.path === '/library') router.push({ path: '/library', query: {} }) }

function openDocs() { window.open('https://github.com/firdaus-rx/pandora-dl', '_blank') }
function openAPI() { router.push('/settings') }

async function handleLogout() {
  const ok = await confirm.confirm({
    title: 'Keluar',
    message: 'Apakah Anda yakin ingin keluar?',
    icon: 'logout',
    confirmText: 'Keluar',
    confirmBg: 'linear-gradient(135deg, #ef4444, #f97316)',
  })
  if (ok) { profileOpen.value = false; await auth.logout(); router.push('/login') }
}
</script>

<style scoped>
router-link { cursor: pointer; }
</style>
