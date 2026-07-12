<template>
  <div class="max-w-[1440px] mx-auto px-4 lg:px-6 py-4 lg:py-8 pb-24 lg:pb-8">
    <div class="flex flex-col gap-6 lg:gap-8">
      <header>
        <h2 class="text-2xl lg:text-[32px] font-semibold text-on-surface tracking-tight">Settings</h2>
        <p class="text-sm lg:text-base text-on-surface-variant">Manage configurations and preferences.</p>
      </header>

      <div class="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6">
        <div class="lg:col-span-3">
          <div class="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 scrollbar-hide">
            <button @click="activeTab = 'ai'" class="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all whitespace-nowrap text-xs lg:text-sm" :class="activeTab === 'ai' ? 'bg-primary-container/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-variant/30'">
              <span class="material-symbols-outlined text-lg">psychology</span>
              <span>AI</span>
            </button>
            <button @click="activeTab = 'system'" class="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all whitespace-nowrap text-xs lg:text-sm" :class="activeTab === 'system' ? 'bg-primary-container/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-variant/30'">
              <span class="material-symbols-outlined text-lg">dns</span>
              <span>System</span>
            </button>
            <button @click="activeTab = 'danger'" class="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all whitespace-nowrap text-xs lg:text-sm" :class="activeTab === 'danger' ? 'bg-error-container/20 text-error font-bold' : 'text-error hover:bg-error-container/20'">
              <span class="material-symbols-outlined text-lg">warning</span>
              <span>Danger</span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-9 space-y-4 lg:space-y-6">
          <section v-if="activeTab === 'ai'" class="glass-panel rounded-xl p-4 lg:p-6">
            <div class="flex items-center gap-3 mb-4 lg:mb-6">
              <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-lg">bolt</span>
              </div>
              <div><h3 class="text-sm lg:text-lg font-medium text-on-surface">AI Configuration</h3><p class="text-xs lg:text-sm text-on-surface-variant">Connect your AI processing engines.</p></div>
            </div>
            <div class="space-y-4 lg:space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Provider</label>
                  <select v-model="form.aiProvider" class="input-field rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-on-surface">
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="groq">Groq</option>
                    <option value="ollama">Ollama</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Model</label>
                  <select v-model="form.aiModel" class="input-field rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-on-surface">
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  </select>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest font-semibold">API Key</label>
                <div class="relative">
                  <input v-model="form.apiKey" class="input-field w-full rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-on-surface pr-10" :type="showKey ? 'text' : 'password'" placeholder="sk-..." />
                  <button @click="showKey = !showKey" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                    <span class="material-symbols-outlined text-sm">{{ showKey ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>
              <div class="flex justify-end pt-2">
                <button @click="saveSettings" class="bg-primary text-on-primary px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg font-bold text-xs lg:text-sm hover:opacity-90 active:scale-95 transition-all" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
              </div>
            </div>
          </section>

          <section v-if="activeTab === 'system'" class="glass-panel rounded-xl p-4 lg:p-6">
            <div class="flex items-center gap-3 mb-4 lg:mb-6">
              <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span class="material-symbols-outlined text-lg">terminal</span>
              </div>
              <div><h3 class="text-sm lg:text-lg font-medium text-on-surface">System</h3><p class="text-xs lg:text-sm text-on-surface-variant">Host and server controls.</p></div>
            </div>
            <div class="space-y-4 lg:space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Port</label>
                  <div class="rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm" style="background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;">{{ form.port }}</div>
                </div>
                <div class="flex flex-col gap-1.5 sm:col-span-2">
                  <label class="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Admin User</label>
                  <input v-model="form.adminUser" class="input-field rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-on-surface" type="text" />
                </div>
              </div>
              <div v-if="sysInfo" class="grid grid-cols-3 gap-3">
                <div class="p-3 rounded-lg bg-surface-container-high border border-outline-variant/10">
                  <p class="text-[9px] lg:text-xs text-on-surface-variant uppercase font-semibold">Platform</p>
                  <p class="text-xs lg:text-sm font-bold mt-0.5 capitalize truncate">{{ sysInfo.platform }} ({{ sysInfo.arch }})</p>
                </div>
                <div class="p-3 rounded-lg bg-surface-container-high border border-outline-variant/10">
                  <p class="text-[9px] lg:text-xs text-on-surface-variant uppercase font-semibold">CPU</p>
                  <p class="text-xs lg:text-sm font-bold mt-0.5">{{ sysInfo.cpu?.cores }}c • {{ sysInfo.cpu?.usagePercent || '0' }}%</p>
                </div>
                <div class="p-3 rounded-lg bg-surface-container-high border border-outline-variant/10">
                  <p class="text-[9px] lg:text-xs text-on-surface-variant uppercase font-semibold">RAM</p>
                  <p class="text-xs lg:text-sm font-bold mt-0.5">{{ sysInfo.memory?.usedFormatted }} / {{ sysInfo.memory?.totalFormatted }}</p>
                </div>
              </div>
              <div class="flex justify-end pt-2">
                <button @click="saveSettings" class="bg-primary text-on-primary px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg font-bold text-xs lg:text-sm hover:opacity-90 active:scale-95 transition-all" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
              </div>
            </div>
          </section>

          <section v-if="activeTab === 'danger'" class="glass-panel rounded-xl p-4 lg:p-6 border border-error/20">
            <div class="flex items-center gap-3 mb-4 lg:mb-6">
              <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-error-container/20 flex items-center justify-center text-error">
                <span class="material-symbols-outlined text-lg">dangerous</span>
              </div>
              <div><h3 class="text-sm lg:text-lg font-medium text-error">Danger Zone</h3><p class="text-xs lg:text-sm text-on-surface-variant">Destructive actions.</p></div>
            </div>
            <div class="flex flex-wrap gap-3">
              <button @click="confirmClear" class="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-bold transition-all" style="border: 1px solid #ef4444; color: #ef4444;">
                <span class="material-symbols-outlined text-lg">cached</span> Hapus Cache
              </button>
              <button @click="confirmReset" class="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-bold transition-all" style="border: 1px solid #ef4444; color: #ef4444;">
                <span class="material-symbols-outlined text-lg">history</span> Reset Pengaturan
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getSettings, updateSettings, getSystem } from '@/api/client'
import { useConfirm } from '@/composables/useConfirm'

const confirm = useConfirm()
const activeTab = ref('ai')
const saving = ref(false)
const showKey = ref(false)
const form = reactive({ aiProvider: 'openai', aiModel: 'gpt-4o-mini', apiKey: '', port: '3000', adminUser: 'admin' })
const sysInfo = ref<any>(null)

onMounted(async () => {
  try {
    const [s, sys] = await Promise.all([getSettings(), getSystem()])
    const v = s.vars
    form.aiProvider = v.AI_PROVIDER || 'openai'
    form.aiModel = v.OPENAI_MODEL || 'gpt-4o-mini'
    form.apiKey = v.OPENAI_API_KEY || ''
    form.port = v.PORT || '3000'
    form.adminUser = v.ADMIN_USER || 'admin'
    sysInfo.value = sys
  } catch {}
})

async function saveSettings() {
  saving.value = true
  try {
    const updates: Record<string, string> = {}
    if (activeTab.value === 'ai') { updates.AI_PROVIDER = form.aiProvider; updates.OPENAI_MODEL = form.aiModel; if (form.apiKey) updates.OPENAI_API_KEY = form.apiKey }
    else if (activeTab.value === 'system') { updates.ADMIN_USER = form.adminUser }
    await updateSettings(updates)
  } catch (e: any) { alert('Error: ' + e.message) } finally { saving.value = false }
}

async function confirmClear() {
  const ok = await confirm.confirm({ title: 'Hapus Cache', message: 'Semua cache library akan dihapus. Tindakan ini tidak bisa dibatalkan.', icon: 'cleaning_services', confirmText: 'Hapus', confirmBg: 'linear-gradient(135deg, #ef4444, #f97316)' })
  if (ok) { /* clear cache logic */ }
}

async function confirmReset() {
  const ok = await confirm.confirm({ title: 'Reset Pengaturan', message: 'Semua pengaturan akan dikembalikan ke default. Tindakan ini tidak bisa dibatalkan.', icon: 'settings_backup_restore', confirmText: 'Reset', confirmBg: 'linear-gradient(135deg, #ef4444, #f97316)' })
  if (ok) { /* reset logic */ }
}
</script>
