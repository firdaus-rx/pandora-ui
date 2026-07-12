<template>
  <div class="min-h-screen antialiased" style="background: #f8fafc;">
    <template v-if="!isAuthPage">
      <Sidebar :mobileOpen="mobileMenu" @toggle="mobileMenu = !mobileMenu" @close="mobileMenu = false" />
      <TopBar @toggleMenu="mobileMenu = !mobileMenu" />
      <main class="transition-all duration-300 lg:ml-[260px] pt-14 lg:pt-16 pb-[72px] lg:pb-0 min-h-screen">
        <router-view />
      </main>
    </template>
    <router-view v-else />
    <ConfirmModal
      :visible="confirm.visible.value"
      :title="confirm.options.value.title"
      :message="confirm.options.value.message"
      :icon="confirm.options.value.icon"
      :iconBg="confirm.options.value.iconBg"
      :iconColor="confirm.options.value.iconColor"
      :confirmText="confirm.options.value.confirmText"
      :cancelText="confirm.options.value.cancelText"
      :confirmBg="confirm.options.value.confirmBg"
      @confirm="confirm.onConfirm()"
      @cancel="confirm.onCancel()"
      @update:visible="confirm.visible.value = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useConfirm } from '@/composables/useConfirm'

const route = useRoute()
const isAuthPage = computed(() => route.meta.noAuth)
const mobileMenu = ref(false)
const confirm = useConfirm()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@450&display=swap');

:root {
  --bg: #f8fafc;
  --bg-card: #ffffff;
  --bg-surface: #f1f5f9;
  --bg-surface-hover: #e2e8f0;
  --text: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --accent: #ef4444;
  --accent-purple: #8b5cf6;
  --accent-gradient: linear-gradient(135deg, #ef4444 0%, #8b5cf6 50%, #3b82f6 100%);
  --border: #e2e8f0;
  --border-accent: #fca5a5;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 30px -5px rgba(239,68,68,0.1), 0 4px 10px -5px rgba(139,92,246,0.08);
  --error: #ef4444;
  --success: #10b981;
  --warning: #f59e0b;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* Animated gradient line at top of page */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ef4444, #8b5cf6, #3b82f6, #ef4444);
  background-size: 300% 100%;
  animation: gradientMove 3s ease infinite;
  z-index: 100;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Decorative grid pattern */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(239, 68, 68, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(239, 68, 68, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.glass-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
}

.primary-gradient {
  background: var(--accent-gradient);
}

.text-gradient {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.button-gradient {
  background: var(--accent-gradient);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-gradient:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25);
}

.input-glow:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  border-color: var(--accent) !important;
}

.glow-hover:hover {
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.15);
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.scrollbar-hide::-webkit-scrollbar { display: none; }

.message-bubble-ai {
  background: #f8fafc;
  border: 1px solid var(--border);
}

.input-field {
  background: #ffffff;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.input-field:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
  outline: none;
}

.bg-animate {
  background: linear-gradient(135deg, #fef2f2 0%, #faf5ff 50%, #eff6ff 100%);
}

.media-player-gradient {
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animated walking border line */
.animate-border-line {
  position: relative;
  overflow: hidden;
}
.animate-border-line::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ef4444, #8b5cf6, transparent);
  animation: borderWalk 2.5s ease-in-out infinite;
}
@keyframes borderWalk {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

/* Red accent box */
.accent-box {
  position: relative;
}
.accent-box::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: inherit;
  pointer-events: none;
}
</style>
