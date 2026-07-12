<template>
  <div class="max-w-[1440px] mx-auto p-3 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 min-h-screen">
    <div class="lg:col-span-8 space-y-4 lg:space-y-8">
      <section v-if="track" class="rounded-2xl lg:rounded-3xl overflow-hidden glass-panel">
        <template v-if="playing && !isAudio(track.format)">
          <video :src="getStreamUrl(track.id)" controls autoplay class="w-full max-h-[50vh] lg:max-h-[70vh] bg-black"></video>
        </template>
        <template v-else>
          <div class="relative aspect-video">
            <div class="absolute inset-0 w-full h-full bg-surface-container flex items-center justify-center" :style="track.thumbnail && !thumbError.has('hero') ? { backgroundImage: `url(${track.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
              <img v-if="track.thumbnail" :src="track.thumbnail" @error="onThumbError('hero')" class="hidden" />
              <span v-if="!track.thumbnail || thumbError.has('hero')" class="material-symbols-outlined text-4xl lg:text-5xl text-on-surface-variant">music_note</span>
            </div>
            <div class="absolute inset-0 media-player-gradient opacity-60"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <button @click="playing = !playing" class="w-14 h-14 lg:w-20 lg:h-20 bg-primary-container/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <span v-if="isAudio(track.format) && playing" class="material-symbols-outlined text-white text-3xl lg:text-5xl" style="font-variation-settings: 'FILL' 1;">equalizer</span>
                <span v-else class="material-symbols-outlined text-white text-3xl lg:text-5xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
              </button>
            </div>
            <div v-if="isAudio(track.format) && playing" class="absolute bottom-2 lg:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
              <span class="w-1 h-3 lg:h-4 bg-white rounded-full animate-pulse" style="animation-delay: 0s;"></span>
              <span class="w-1 h-4 lg:h-6 bg-primary rounded-full animate-pulse" style="animation-delay: 0.2s;"></span>
              <span class="w-1 h-2 lg:h-3 bg-white rounded-full animate-pulse" style="animation-delay: 0.4s;"></span>
              <span class="text-[10px] lg:text-xs text-white/80 font-mono ml-2">Now Playing</span>
            </div>
          </div>
        </template>
        <div v-if="playing && isAudio(track.format)" class="border-t border-outline-variant/10">
          <audio :src="getStreamUrl(track.id)" controls autoplay class="w-full h-12 lg:h-14 bg-surface-container-lowest"></audio>
        </div>
      </section>

      <section class="space-y-4 lg:space-y-6" v-if="track">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2 py-0.5 bg-secondary-container/20 text-secondary text-[9px] lg:text-[10px] font-bold rounded uppercase tracking-wider">Downloaded</span>
              <span class="text-on-surface-variant flex items-center gap-1 text-xs lg:text-sm">
                <span class="material-symbols-outlined text-xs lg:text-sm">public</span>
                <span class="capitalize truncate">{{ track.platform }}</span>
              </span>
            </div>
            <h2 class="text-xl lg:text-4xl font-bold text-on-surface font-semibold tracking-tight leading-tight">{{ track.title }}</h2>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button @click="playing = !playing" class="flex items-center gap-1.5 px-3 lg:px-5 py-2 lg:py-2.5 bg-primary-container text-on-primary-container rounded-xl font-bold text-xs lg:text-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <span class="material-symbols-outlined text-sm lg:text-base">{{ playing ? 'stop' : 'play_circle' }}</span>
              <span class="hidden sm:inline">{{ playing ? 'Stop' : 'Play' }}</span>
            </button>
            <a :href="getDownloadUrl(track.id)" class="flex items-center gap-1.5 px-3 lg:px-5 py-2 lg:py-2.5 bg-surface-container text-on-surface border border-outline-variant/20 rounded-xl font-medium text-xs lg:text-sm hover:bg-surface-variant transition-all">
              <span class="material-symbols-outlined text-sm lg:text-base">download</span>
              <span class="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 p-4 lg:p-6 glass-panel rounded-2xl">
          <div><p class="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest opacity-60">Uploader</p><p class="text-xs lg:text-sm font-bold truncate">{{ track.uploader || 'Unknown' }}</p></div>
          <div><p class="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest opacity-60">Date</p><p class="text-xs lg:text-sm font-bold">{{ formatDate(track.downloadedAt) }}</p></div>
          <div><p class="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest opacity-60">Views</p><p class="text-xs lg:text-sm font-bold">{{ track.viewCount ? formatNumber(track.viewCount) : 'N/A' }}</p></div>
          <div><p class="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest opacity-60">Size</p><p class="text-xs lg:text-sm font-bold">{{ formatSize(track.fileSize) }}</p></div>
        </div>

        <div v-if="track.description" class="text-xs lg:text-sm text-on-surface-variant leading-relaxed line-clamp-3 lg:line-clamp-none">{{ track.description }}</div>
      </section>

      <div v-else-if="loading" class="flex items-center justify-center py-20"><span class="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span></div>
      <div v-else class="flex flex-col items-center justify-center py-20 text-on-surface-variant"><span class="material-symbols-outlined text-5xl mb-4">music_off</span><p class="text-sm">Track not found</p></div>
    </div>

    <div class="lg:col-span-4 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm lg:text-lg font-bold text-on-surface">Related</h3>
        <router-link to="/library" class="text-primary text-xs font-bold hover:underline">View All</router-link>
      </div>
      <div class="space-y-3 lg:space-y-4 max-h-[50vh] lg:max-h-[800px] overflow-y-auto pr-1 lg:pr-2">
        <router-link v-for="t in relatedTracks" :key="t.id" :to="`/library/${t.id}`" class="flex gap-3 group cursor-pointer p-2 rounded-xl hover:bg-surface-variant/20 transition-all border border-transparent hover:border-outline-variant/10">
          <div class="w-24 h-16 lg:w-32 lg:h-20 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-container">
            <img v-if="t.thumbnail" :src="t.thumbnail" @error="onThumbError(t.id)" class="w-full h-full object-cover" :class="thumbError.has(t.id) ? 'hidden' : ''" />
            <div v-if="!t.thumbnail || thumbError.has(t.id)" class="w-full h-full flex items-center justify-center"><span class="material-symbols-outlined text-lg text-on-surface-variant">music_note</span></div>
            <span v-if="t.duration" class="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 rounded text-white font-mono">{{ t.duration }}</span>
          </div>
          <div class="flex flex-col justify-center gap-1 min-w-0">
            <h4 class="text-xs lg:text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">{{ t.title || 'Untitled' }}</h4>
            <p class="text-[10px] lg:text-[11px] text-on-surface-variant opacity-60 truncate">{{ t.uploader || t.channel || 'Unknown' }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getLibrary, getStreamUrl, getDownloadUrl } from '@/api/client'

const route = useRoute()
const track = ref<any>(null)
const allTracks = ref<any[]>([])
const loading = ref(true)
const playing = ref(false)
const thumbError = ref<Set<string>>(new Set())

function onThumbError(id: string) { thumbError.value = new Set([...thumbError.value, id]) }

const audioFormats = ['mp3', 'aac', 'flac', 'm4a', 'opus', 'wav', 'vorbis', 'alac', 'ogg']
function isAudio(f: string) { return audioFormats.includes(f?.toLowerCase()) }

const relatedTracks = computed(() => allTracks.value.filter(t => t.id !== track.value?.id).slice(0, 5))

async function loadTrack(id: string) {
  loading.value = true; playing.value = false; thumbError.value = new Set()
  try {
    const res = await getLibrary({ id })
    track.value = res.track
    const allRes = await getLibrary({ platform: track.value?.platform })
    allTracks.value = allRes.groups ? Object.values(allRes.groups).flatMap((g: any) => g.tracks || []) : []
  } catch { track.value = null } finally { loading.value = false }
}

watch(() => route.params.id, (id) => { if (id) loadTrack(id as string) })
onMounted(() => loadTrack(route.params.id as string))

function formatDate(d: string) { return d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A' }
function formatNumber(n: number) { if (!n) return '0'; if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'; if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'; return n.toString() }
function formatSize(b: number) { if (!b) return '0 B'; const u = ['B', 'KB', 'MB', 'GB']; const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), 3); return (b / Math.pow(1024, i)).toFixed(1) + ' ' + u[i] }
</script>
