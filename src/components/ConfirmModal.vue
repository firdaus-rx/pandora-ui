<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.3);" @click.self="cancel">
        <Transition name="modal-scale" appear>
          <div v-if="visible" class="w-full max-w-sm rounded-2xl overflow-hidden" style="background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 25px 60px rgba(0,0,0,0.12);">
            <div class="p-6 text-center">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" :style="{ background: iconBg }">
                <span class="material-symbols-outlined text-2xl" :style="{ color: iconColor }">{{ icon }}</span>
              </div>
              <h3 class="text-lg font-bold mb-2" style="color: #0f172a;">{{ title }}</h3>
              <p class="text-sm" style="color: #64748b;">{{ message }}</p>
            </div>
            <div class="flex gap-3 px-6 pb-6">
              <button @click="cancel" class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all" style="background: #f1f5f9; color: #475569;">
                {{ cancelText }}
              </button>
              <button @click="confirm" class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all text-white" :style="{ background: confirmBg }">
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  visible: boolean
  title?: string
  message?: string
  icon?: string
  iconBg?: string
  iconColor?: string
  confirmText?: string
  cancelText?: string
  confirmBg?: string
  danger?: boolean
}>(), {
  title: 'Konfirmasi',
  message: 'Apakah Anda yakin?',
  icon: 'help',
  iconBg: '#fef2f2',
  iconColor: '#ef4444',
  confirmText: 'Ya',
  cancelText: 'Batal',
  confirmBg: 'linear-gradient(135deg, #ef4444, #f97316)',
  danger: false,
})

const emit = defineEmits<{ confirm: []; cancel: []; 'update:visible': [value: boolean] }>()

watch(() => props.visible, (v) => { if (!v) emit('update:visible', false) })

function confirm() { emit('confirm'); emit('update:visible', false) }
function cancel() { emit('cancel'); emit('update:visible', false) }
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-scale-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-scale-leave-active { transition: all 0.15s ease; }
.modal-scale-enter-from { opacity: 0; transform: scale(0.9); }
.modal-scale-leave-to { opacity: 0; transform: scale(0.95); }
</style>
