<template>
  <div class="min-h-screen flex items-center justify-center p-4 lg:p-6 relative" style="background: linear-gradient(135deg, #fef2f2 0%, #faf5ff 50%, #eff6ff 100%);">
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1" style="background: linear-gradient(90deg, #ef4444, #8b5cf6, #3b82f6, #ef4444); background-size: 300% 100%; animation: gradientMove 3s ease infinite;"></div>
      <div class="absolute inset-0" style="background-image: linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px); background-size: 40px 40px;"></div>
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] opacity-10" style="background: radial-gradient(circle, #ef4444 0%, transparent 70%);"></div>
      <div class="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] opacity-10" style="background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);"></div>
    </div>

    <main class="w-full max-w-[420px] z-10">
      <div class="rounded-2xl p-6 lg:p-8 flex flex-col gap-6 lg:gap-8" style="background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 20px 60px rgba(239,68,68,0.08), 0 10px 30px rgba(0,0,0,0.04);">
        <div class="flex flex-col items-center gap-3 text-center">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, #fecaca, #ede9fe);">
            <span class="material-symbols-outlined text-3xl" style="color: #dc2626; font-variation-settings: 'FILL' 1;">smart_toy</span>
          </div>
          <div>
            <h1 class="text-3xl lg:text-4xl font-bold tracking-tight" style="background: linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">MediaAI</h1>
            <p class="text-sm mt-1" style="color: #64748b;">Downloader pintar berbasis AI</p>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold ml-1 uppercase tracking-widest" style="color: #64748b;">Username</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg" style="color: #94a3b8;">person</span>
              <input v-model="username" class="w-full rounded-xl py-3 pl-12 pr-4 text-sm outline-none transition-all" placeholder="Masukkan username" type="text" required
                style="background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a;"
                @focus="e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.08)'; }"
                @blur="e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold ml-1 uppercase tracking-widest" style="color: #64748b;">Kata Sandi</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg" style="color: #94a3b8;">lock</span>
              <input v-model="password" class="w-full rounded-xl py-3 pl-12 pr-12 text-sm outline-none transition-all" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required
                style="background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a;"
                @focus="e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.08)'; }"
                @blur="e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }"
              />
              <button @click="showPassword = !showPassword" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 transition-colors" style="color: #94a3b8;">
                <span class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button type="submit" class="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all text-white" :disabled="loading"
            style="background: linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%); box-shadow: 0 4px 20px rgba(239,68,68,0.25);"
            @mouseenter="e => e.target.style.boxShadow = '0 6px 30px rgba(239,68,68,0.35)'"
            @mouseleave="e => e.target.style.boxShadow = '0 4px 20px rgba(239,68,68,0.25)'"
          >
            <template v-if="loading"><span class="material-symbols-outlined animate-spin text-lg">progress_activity</span> Memproses...</template>
            <template v-else>Masuk <span class="material-symbols-outlined text-lg">arrow_forward</span></template>
          </button>
          <p v-if="error" class="text-xs text-center" style="color: #ef4444;">{{ error }}</p>
        </form>

        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4">
            <div class="h-px flex-1" style="background: #e2e8f0;"></div>
            <span class="text-xs font-semibold uppercase tracking-widest" style="color: #94a3b8;">Atau</span>
            <div class="h-px flex-1" style="background: #e2e8f0;"></div>
          </div>
          <p class="text-center text-xs" style="color: #64748b;">
            Belum punya akun? <a class="font-bold cursor-pointer" style="color: #ef4444;">Hubungi Admin</a>
          </p>
        </div>
      </div>
    </main>
    </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true; error.value = ''
  try { await auth.login(username.value, password.value); router.push('/') }
  catch (e: any) { error.value = e.message || 'Login gagal' }
  finally { loading.value = false }
}
</script>
