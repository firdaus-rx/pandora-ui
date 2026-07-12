<template>
  <div class="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)]">
    <div class="hidden lg:flex w-72 xl:w-80 flex-col flex-shrink-0 m-3 ml-0 rounded-2xl overflow-hidden" style="background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
      <div class="px-5 py-4 flex justify-between items-center" style="border-bottom: 1px solid #f1f5f9;">
        <h2 class="text-sm font-bold" style="color: #0f172a;">Riwayat</h2>
        <button @click="newChat" class="transition-colors p-1 rounded-lg" style="color: #ef4444;">
          <span class="material-symbols-outlined text-xl">edit_square</span>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto scrollbar-hide px-3 py-2 space-y-1">
        <div v-for="s in sessions" :key="s.id"
          @click="loadSession(s.id)"
          class="p-3 rounded-xl cursor-pointer transition-all"
          :style="currentSessionId === s.id ? 'background: #fef2f2; border: 1px solid #fecaca;' : 'border: 1px solid transparent;'"
        >
          <div class="flex justify-between items-start mb-0.5">
            <span class="text-[10px] font-mono uppercase truncate font-semibold" :style="currentSessionId === s.id ? 'color: #ef4444;' : 'color: #94a3b8;'">{{ s.platform || 'Chat' }}</span>
            <span class="text-[10px] ml-2 whitespace-nowrap" style="color: #94a3b8;">{{ timeAgo(s.updatedAt) }}</span>
          </div>
          <p class="text-xs font-medium truncate" :style="currentSessionId === s.id ? 'color: #0f172a;' : 'color: #475569;'">{{ s.title }}</p>
          <div class="mt-1 flex items-center gap-1 text-[10px]">
            <span class="material-symbols-outlined text-[10px]" :style="s.status === 'error' ? 'color: #ef4444;' : 'color: #10b981;'">{{ s.status === 'error' ? 'error' : 'check_circle' }}</span>
            <span :style="s.status === 'error' ? 'color: #ef4444;' : 'color: #94a3b8;'">{{ s.statusText || s.format?.toUpperCase() || 'Selesai' }}</span>
          </div>
        </div>
        <div v-if="sessions.length === 0" class="text-center py-8 text-xs" style="color: #94a3b8;">Belum ada riwayat.</div>
      </div>
    </div>

    <div class="flex-1 flex flex-col h-full relative">
      <div class="lg:hidden flex items-center gap-2 px-4 py-2.5" style="background: #ffffff; border-bottom: 1px solid #e2e8f0;">
        <button @click="showHistory = !showHistory" class="flex items-center gap-1 text-xs font-bold transition-colors" style="color: #ef4444;">
          <span class="material-symbols-outlined text-sm">{{ showHistory ? 'close' : 'history' }}</span>
          {{ showHistory ? 'Tutup' : 'Riwayat' }} ({{ sessions.length }})
        </button>
        <button @click="newChat" class="ml-auto p-1 rounded-lg transition-colors" style="color: #ef4444;">
          <span class="material-symbols-outlined text-lg">edit_square</span>
        </button>
      </div>

      <div v-if="showHistory" class="lg:hidden flex-1 overflow-y-auto px-3 py-3 space-y-1.5" style="background: #f8fafc;">
        <div v-for="s in sessions" :key="s.id"
          @click="loadSession(s.id); showHistory = false"
          class="p-3 rounded-xl cursor-pointer transition-all" style="background: #ffffff; border: 1px solid #e2e8f0;"
          :style="currentSessionId === s.id ? 'background: #fef2f2; border-color: #fecaca;' : ''"
        >
          <p class="text-xs font-medium truncate" :style="currentSessionId === s.id ? 'color: #0f172a;' : 'color: #475569;'">{{ s.title }}</p>
          <div class="flex items-center gap-2 text-[10px] mt-0.5">
            <span class="font-mono uppercase font-semibold" :style="currentSessionId === s.id ? 'color: #ef4444;' : 'color: #94a3b8;'">{{ s.platform || 'Chat' }}</span>
            <span style="color: #94a3b8;">{{ timeAgo(s.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <div v-show="!showHistory" class="flex-1 flex flex-col min-h-0">
        <div ref="chatContainer" class="flex-1 overflow-y-auto px-3 lg:px-6 py-4 lg:py-8 space-y-4 lg:space-y-8 scrollbar-hide">
          <div v-if="messages.length === 0 && !processingDownload" class="flex gap-3 max-w-3xl">
            <div class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-on-primary-container text-xs lg:text-sm">smart_toy</span>
            </div>
            <div class="message-bubble-ai p-3 lg:p-4 rounded-2xl rounded-tl-none">
              <p class="text-sm lg:text-base text-on-surface">Paste a link to start downloading.</p>
            </div>
          </div>

          <div v-for="(msg, i) in messages" :key="i">
            <div v-if="msg.role === 'assistant'" class="flex gap-3 max-w-3xl">
              <div class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-on-primary-container text-xs lg:text-sm">smart_toy</span>
              </div>
              <div class="space-y-3 lg:space-y-4 min-w-0 flex-1">
                <div v-if="msg.content" class="message-bubble-ai p-3 lg:p-4 rounded-2xl rounded-tl-none">
                  <p class="text-sm lg:text-base text-on-surface">{{ msg.content }}</p>
                </div>
                <div v-if="msg.command" class="message-bubble-ai p-3 lg:p-4 rounded-2xl rounded-tl-none border-l-4 border-primary">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                    <span class="text-[10px] lg:text-xs text-primary uppercase tracking-widest font-semibold">Command Parsed</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 lg:gap-4">
                    <div class="bg-surface-container-highest/30 p-2 lg:p-3 rounded-xl"><p class="text-[9px] lg:text-[10px] text-on-surface-variant uppercase mb-1">Platform</p><p class="text-xs lg:text-sm font-bold capitalize">{{ msg.command.platform || 'N/A' }}</p></div>
                    <div class="bg-surface-container-highest/30 p-2 lg:p-3 rounded-xl"><p class="text-[9px] lg:text-[10px] text-on-surface-variant uppercase mb-1">Format</p><p class="text-xs lg:text-sm font-bold uppercase">{{ msg.command.format || 'N/A' }}</p></div>
                    <div class="bg-surface-container-highest/30 p-2 lg:p-3 rounded-xl"><p class="text-[9px] lg:text-[10px] text-on-surface-variant uppercase mb-1">Folder</p><p class="text-xs lg:text-sm font-bold truncate">{{ msg.command.playlist || 'Default' }}</p></div>
                  </div>
                </div>
                <div v-if="msg.results?.length" v-for="(result, ri) in msg.results" :key="ri">
                  <div v-if="result.success" class="glass-panel rounded-2xl overflow-hidden">
                    <div class="flex gap-2 lg:gap-3 p-2.5 lg:p-3">
                      <div class="w-20 h-14 lg:w-28 lg:h-[70px] rounded-xl overflow-hidden shrink-0 bg-surface-container">
                        <img v-if="result.track?.thumbnail" :src="result.track.thumbnail" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center"><span class="material-symbols-outlined text-xl text-on-surface-variant">music_note</span></div>
                        <div v-if="result.track?.duration" class="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">{{ result.track.duration }}</div>
                      </div>
                      <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5 lg:gap-1">
                        <h3 class="text-xs lg:text-sm font-semibold text-on-surface truncate">{{ result.title }}</h3>
                        <div class="flex items-center gap-2 text-[10px] lg:text-[11px]">
                          <span class="text-on-surface-variant">{{ result.track?.fileSize ? formatSize(result.track.fileSize) : '' }}</span>
                          <span class="px-1 py-0.5 bg-primary/10 text-primary rounded text-[9px] font-mono uppercase">{{ result.track?.format || 'mp3' }}</span>
                        </div>
                        <div class="flex items-center gap-1 mt-0.5">
                          <button @click="togglePlay(currentSessionId + '-' + ri)" class="flex items-center gap-1 px-2 lg:px-3 py-1 bg-primary-container/20 hover:bg-primary-container/40 text-primary rounded-lg text-[10px] lg:text-xs font-semibold transition-colors">
                            <span class="material-symbols-outlined text-xs lg:text-sm">{{ isPlaying(currentSessionId + '-' + ri) ? 'stop' : 'play_arrow' }}</span>
                            <span class="hidden lg:inline">{{ isPlaying(currentSessionId + '-' + ri) ? 'Stop' : 'Play' }}</span>
                          </button>
                          <a :href="getDownloadUrl(result.track?.id)" class="flex items-center gap-1 px-2 lg:px-3 py-1 bg-surface-variant/30 hover:bg-surface-variant/60 text-on-surface rounded-lg text-[10px] lg:text-xs transition-colors">
                            <span class="material-symbols-outlined text-xs lg:text-sm">download</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div v-if="isPlaying(currentSessionId + '-' + ri)" class="border-t border-outline-variant/10 px-3 py-2 bg-surface-container-low/50">
                      <audio v-if="isAudio(result.track?.format)" :src="getStreamUrl(result.track?.id)" controls autoplay class="w-full h-8 rounded-lg" style="height: 32px;"></audio>
                      <video v-else :src="getStreamUrl(result.track?.id)" controls autoplay class="w-full rounded-lg" style="max-height: 100px;"></video>
                    </div>
                  </div>
                  <div v-else class="p-3 lg:p-4 rounded-2xl" style="background: #fef2f2; border: 1px solid #fecaca;">
                    <div class="flex gap-3">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background: #fee2e2;">
                        <span class="text-xl">❌</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="text-sm font-bold mb-1" style="color: #ef4444;">Download Gagal</h3>
                        <p class="text-xs text-on-surface-variant">{{ result.error || 'Unknown' }}</p>
                        <div class="mt-2 flex gap-2">
                          <button @click="retryWithMessage(msg.command)" class="px-3 py-1 bg-primary-container/20 text-primary border border-primary/20 rounded-lg text-[10px] font-bold hover:bg-primary-container/40 transition-colors">Retry</button>
                          <button @click="copyUrl(msg.command?.urls?.[0])" class="px-3 py-1 bg-surface-variant/40 text-on-surface rounded-lg text-[10px] hover:bg-surface-variant/60 transition-colors">Copy URL</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="msg.role === 'user'" class="flex gap-3 max-w-3xl ml-auto flex-row-reverse">
              <div class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 border border-outline-variant/30">
                <span class="material-symbols-outlined text-on-surface text-xs lg:text-sm">person</span>
              </div>
              <div class="bg-primary text-on-primary p-3 lg:p-4 rounded-2xl rounded-tr-none shadow-lg">
                <p class="text-sm lg:text-base">{{ msg.content }}</p>
              </div>
            </div>
          </div>

          <div v-if="processingDownload" class="flex gap-3 max-w-3xl">
            <div class="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-on-primary-container text-xs lg:text-sm">smart_toy</span>
            </div>
            <div class="message-bubble-ai p-3 lg:p-4 rounded-2xl rounded-tl-none min-w-[200px] lg:min-w-[320px]">
              <div class="flex flex-col gap-2 lg:gap-3">
                <div class="flex items-center gap-2 lg:gap-3">
                  <span class="material-symbols-outlined animate-spin text-primary text-lg">progress_activity</span>
                  <p class="text-sm lg:text-base text-on-surface">{{ progressMessage }}</p>
                </div>
                <div class="w-full h-1.5 lg:h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500 ease-out" :class="progressStage === 'error' ? 'bg-error' : 'bg-primary'" :style="{ width: progressPercent + '%' }"></div>
                </div>
                <div class="flex items-center gap-1 text-[10px] lg:text-xs text-on-surface-variant">
                  <span class="material-symbols-outlined text-xs lg:text-sm">{{ progressIcon }}</span>
                  <span>{{ progressStageText }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-shrink-0 px-3 lg:px-6 py-3 lg:py-4 pt-2 lg:pt-4 z-20 border-t border-outline-variant/5 bg-background pb-[76px] lg:pb-4">
          <div class="max-w-4xl mx-auto space-y-2 lg:space-y-3">
            <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button @click="suggestClick(s)" v-for="s in suggestions" :key="s" class="shrink-0 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full border border-outline-variant/20 bg-surface-container/50 text-[10px] lg:text-xs hover:bg-surface-variant/30 hover:border-primary/50 transition-all whitespace-nowrap">{{ s }}</button>
            </div>
            <div class="glass-panel p-1.5 lg:p-2 rounded-[2rem] flex items-center gap-1 lg:gap-2 transition-all" :class="{ 'input-glow': focused }">
              <input v-model="input" @focus="focused = true" @blur="focused = false" @keyup.enter="sendMessage"
                class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant py-2 lg:py-3 px-2 lg:px-3 text-sm lg:text-base"
                :placeholder="isMobile ? 'Paste URL...' : 'Paste YouTube/IG/TikTok URL...'"
                type="text" :disabled="processingDownload || loadingHistory"
              />
              <button @click="sendMessage" class="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0" :class="processingDownload ? 'bg-surface-variant text-on-surface-variant' : 'bg-primary-container text-on-primary-container hover:scale-105 active:scale-95'" :disabled="!input.trim() || processingDownload || loadingHistory">
                <span class="material-symbols-outlined text-lg">{{ processingDownload ? 'progress_activity' : 'send' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { chat, getChatSessions, getChatSession, getDownloadUrl, getStreamUrl } from '@/api/client'

const router = useRouter()
const route = useRoute()

const input = ref('')
const focused = ref(false)
const processingDownload = ref(false)
const loadingHistory = ref(false)
const sessionsLoading = ref(false)
const playingId = ref<string | null>(null)
const currentSessionId = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const progressPercent = ref(0)
const progressMessage = ref('Processing...')
const progressStage = ref<'queued' | 'parsing' | 'downloading' | 'converting' | 'complete' | 'error'>('queued')
const showHistory = ref(false)
const isMobile = ref(false)

let pollTimer: ReturnType<typeof setInterval> | null = null
let pollCount = 0

const progressStageText = computed(() => {
  const m: Record<string, string> = { queued: 'Queued', parsing: 'Analyzing URL...', downloading: 'Downloading...', converting: 'Converting...', complete: '✅ Done!', error: '❌ Failed' }
  return m[progressStage.value] || 'Processing...'
})

const progressIcon = computed(() => {
  const m: Record<string, string> = { queued: 'hourglass_top', parsing: 'search', downloading: 'cloud_download', converting: 'transform', complete: 'check_circle', error: 'error' }
  return m[progressStage.value] || 'progress_activity'
})

const suggestions = ['🎵 Audio from YT', '🎬 IG Reel', '📱 TikTok Vid', '📄 Get Subtitles']
const sessions = reactive<any[]>([])
const messages = reactive<any[]>([])

onMounted(() => {
  isMobile.value = window.innerWidth < 1024
  window.addEventListener('resize', () => { isMobile.value = window.innerWidth < 1024 })
  fetchSessions()
  const id = route.query.id as string
  if (id) loadSession(id)
})

onUnmounted(() => { if (pollTimer) { clearInterval(pollTimer); pollTimer = null } })

function scrollToBottom() { nextTick(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight }) }
function isPlaying(k: string) { return playingId.value === k }
function togglePlay(k: string) { playingId.value = playingId.value === k ? null : k }

const audioFormats = ['mp3', 'aac', 'flac', 'm4a', 'opus', 'wav', 'vorbis', 'alac', 'ogg']
function isAudio(f: string) { return audioFormats.includes(f?.toLowerCase()) }

async function fetchSessions() {
  try {
    const res = await getChatSessions()
    sessions.splice(0, sessions.length, ...res.sessions)
  } catch {}
}

async function loadSession(id: string) {
  if (id === currentSessionId.value) return
  loadingHistory.value = true
  currentSessionId.value = id
  messages.splice(0, messages.length)
  router.replace({ query: { id } })
  try {
    const res = await getChatSession(id)
    if (res.session) messages.splice(0, messages.length, ...res.session.messages)
    scrollToBottom()
  } catch {} finally { loadingHistory.value = false }
}

function newChat() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  currentSessionId.value = ''
  messages.splice(0, messages.length)
  playingId.value = null
  input.value = ''
  processingDownload.value = false
  loadingHistory.value = false
  progressPercent.value = 0
  progressStage.value = 'queued'
  showHistory.value = false
  router.replace({ query: {} })
}

function startPolling(sessionId: string) {
  pollCount = 0
  pollTimer = setInterval(async () => {
    if (!processingDownload.value) { if (pollTimer) { clearInterval(pollTimer); pollTimer = null } return }
    pollCount++
    progressPercent.value = Math.min(15 + pollCount * 5, 85)
    progressMessage.value = pollCount < 3 ? '📥 Downloading...' : pollCount < 8 ? '⚙️ Processing...' : '⏳ Still running...'
    progressStage.value = 'downloading'
    try {
      const res = await getChatSession(sessionId)
      if (!res.session) return
      const msgs = res.session.messages
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant' && last.results) {
        progressPercent.value = 100; progressMessage.value = '✅ Done!'; progressStage.value = 'complete'
        await loadSession(sessionId)
        processingDownload.value = false
        await fetchSessions()
        if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
        return
      }
    } catch {}
    if (pollCount > 40) { progressMessage.value = '⏱️ Timeout. Check status.'; progressStage.value = 'error'; if (pollTimer) { clearInterval(pollTimer); pollTimer = null } }
  }, 1500)
}

async function sendMessage() {
  const text = input.value.trim()
  if (!text || processingDownload.value || loadingHistory.value) return
  input.value = ''
  const hasUrl = !!text.match(/https?:\/\/\S+/)
  messages.push({ role: 'user', content: text })
  if (hasUrl) { processingDownload.value = true; progressPercent.value = 3; progressMessage.value = '🔍 Analyzing URL...'; progressStage.value = 'parsing' }
  scrollToBottom()
  try {
    const res = await chat(text, currentSessionId.value || undefined)
    if (!res.sessionId) { messages.push({ role: 'assistant', content: '❌ Failed to create session' }); processingDownload.value = false; scrollToBottom(); return }
    currentSessionId.value = res.sessionId
    router.replace({ query: { id: res.sessionId } })
    if (hasUrl) { progressPercent.value = 10; progressMessage.value = '📥 Starting download...'; startPolling(res.sessionId) }
    else { messages.push({ role: 'assistant', content: '✅ Done.', command: res.command }); processingDownload.value = false; scrollToBottom(); await fetchSessions() }
  } catch (e: any) { messages.push({ role: 'assistant', content: `❌ ${e.message || 'Error'}` }); processingDownload.value = false; scrollToBottom() }
}

function retryWithMessage(cmd: any) { input.value = cmd?.raw || (cmd?.urls?.length ? `download ${cmd.urls[0]} ${cmd.format || 'mp3'}` : '') }
function copyUrl(url: string) { if (url) navigator.clipboard.writeText(url) }
function suggestClick(t: string) { input.value = t }

function formatSize(b: number) {
  if (!b) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), 3)
  return (b / Math.pow(1024, i)).toFixed(1) + ' ' + u[i]
}

function timeAgo(date: string) {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}
</script>
