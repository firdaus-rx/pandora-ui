<template>
  <div class="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
    <div class="hidden lg:flex w-56 xl:w-64 border-r border-outline-variant/5 bg-surface-container-lowest/30 flex-col overflow-y-auto flex-shrink-0">
      <div class="p-3 xl:p-4">
        <p class="text-[10px] xl:text-xs text-on-surface-variant uppercase mb-2 tracking-widest opacity-50 font-semibold">Directories</p>
        <div class="space-y-1">
          <button @click="filterPlatform('')" class="flex items-center gap-2 w-full p-2 rounded-lg transition-all text-sm" :class="readQuery().platform === '' ? 'text-primary font-bold bg-primary/5' : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/20'">
            <span class="material-symbols-outlined text-lg">folder_open</span>
            <span class="text-xs xl:text-sm">All</span>
            <span class="ml-auto text-[10px] bg-primary/20 px-1.5 py-0.5 rounded-full">{{ stats.total }}</span>
          </button>
          <div class="pt-2 space-y-1">
            <details class="group" open>
              <summary class="flex items-center gap-2 p-2 text-on-surface-variant hover:text-primary cursor-pointer list-none text-xs xl:text-sm">
                <span class="material-symbols-outlined text-lg transition-transform group-open:rotate-90">chevron_right</span>
                <span class="font-medium">Platforms</span>
              </summary>
              <div class="pl-6 space-y-1 mt-1">
                <button v-for="p in platforms" :key="p.name" @click="filterPlatform(p.name)" class="flex items-center justify-between w-full p-2 rounded-lg text-xs xl:text-sm transition-all" :class="readQuery().platform === p.name ? 'text-primary font-bold bg-primary/5' : 'text-on-surface-variant hover:bg-surface-variant/20'">
                  <span class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: p.color }"></span>
                    <span class="capitalize truncate">{{ p.name }}</span>
                  </span>
                  <span class="text-[10px] opacity-40">{{ p.count }}</span>
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col bg-surface-container-low/20 overflow-hidden">
      <div class="p-4 lg:p-6 flex flex-col gap-3 border-b border-outline-variant/5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl lg:text-[32px] font-semibold text-on-surface tracking-tight">Library</h2>
            <p class="text-xs lg:text-sm text-on-surface-variant hidden sm:block">{{ filteredTracks.length }} tracks</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex bg-surface-container rounded-lg p-0.5">
              <button class="p-1.5 bg-primary/20 text-primary rounded-md"><span class="material-symbols-outlined text-lg">grid_view</span></button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button @click="filterFormat('')" class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all" :class="readQuery().format === '' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant font-medium hover:bg-surface-variant/40'">All</button>
          <button @click="filterFormat('video')" class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all" :class="readQuery().format === 'video' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant/40'">Video</button>
          <button @click="filterFormat('audio')" class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all" :class="readQuery().format === 'audio' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant/40'">Audio</button>
          <button @click="filterFormat('image')" class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all" :class="readQuery().format === 'image' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant/40'">Image</button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 lg:p-6">
        <div v-if="loading" class="flex items-center justify-center py-20">
          <span class="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
        </div>
        <div v-else-if="filteredTracks.length === 0" class="flex flex-col items-center justify-center py-16 text-on-surface-variant">
          <span class="material-symbols-outlined text-5xl mb-3">video_library</span>
          <p class="text-sm">No media found</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-6">
          <div v-for="track in filteredTracks" :key="track.id" @click="goToPlayer(track.id)" class="glass-panel rounded-xl overflow-hidden flex flex-col group/card transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
            <div class="relative aspect-video">
              <img v-if="track.thumbnail" :src="track.thumbnail" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-surface-container flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-on-surface-variant">music_note</span>
              </div>
              <div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md flex items-center gap-1 text-[9px] font-bold text-white">
                <span class="w-1 h-1 rounded-full" :style="{ backgroundColor: platformColor(track.platform) }"></span>
                <span class="capitalize">{{ track.platform }}</span>
              </div>
              <div v-if="track.duration" class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-white">{{ track.duration }}</div>
            </div>
            <div class="p-2.5 lg:p-4 flex flex-col gap-1.5">
              <h3 class="text-xs lg:text-sm font-bold truncate text-on-surface">{{ track.title }}</h3>
              <div class="flex items-center justify-between text-[10px] text-on-surface-variant/60 font-mono">
                <span>{{ track.fileSize ? formatSize(track.fileSize) : '' }}</span>
                <span class="uppercase">{{ track.format }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getLibrary, deleteTrack } from '@/api/client'

const router = useRouter()
const route = useRoute()

const tracks = ref<any[]>([])
const stats = ref<any>({ total: 0 })
const loading = ref(false)

function readQuery() {
  return {
    platform: (route.query.platform as string) || '',
    format: (route.query.format as string) || '',
    q: (route.query.q as string) || '',
  }
}

const platforms = computed(() => {
  const c: Record<string, number> = {}
  for (const t of tracks.value) {
    const p = t.platform || 'other'
    c[p] = (c[p] || 0) + 1
  }
  const colors: Record<string, string> = { youtube: '#ef4444', tiktok: '#f472b6', instagram: '#a855f7', facebook: '#2563eb' }
  return Object.entries(c).map(([name, count]) => ({ name, count, color: colors[name] || '#d2bbff' }))
})

const filteredTracks = computed(() => {
  let result = [...tracks.value]
  const q = readQuery()
  if (q.platform) result = result.filter(t => t.platform === q.platform)
  if (q.format === 'audio') result = result.filter(t => ['mp3', 'aac', 'flac', 'm4a', 'opus', 'wav'].includes(t.format?.toLowerCase()))
  else if (q.format === 'video') result = result.filter(t => ['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v'].includes(t.format?.toLowerCase()))
  else if (q.format === 'image') result = result.filter(t => ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(t.format?.toLowerCase()))
  if (q.q) {
    const sq = q.q.toLowerCase()
    result = result.filter(t => t.title?.toLowerCase().includes(sq) || t.uploader?.toLowerCase().includes(sq))
  }
  return result
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await getLibrary()
    stats.value = res
    tracks.value = res.groups ? Object.values(res.groups).flatMap((g: any) => g.tracks || []) : []
  } finally { loading.value = false }
})

function filterPlatform(name: string) {
  const q = readQuery()
  router.push({ query: { ...route.query, platform: q.platform === name ? undefined : name } })
}

function filterFormat(fmt: string) {
  const q = readQuery()
  router.push({ query: { ...route.query, format: q.format === fmt ? undefined : fmt } })
}

function goToPlayer(id: string) { router.push(`/library/${id}`) }

function formatSize(bytes: number) {
  if (!bytes) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB']
  return (bytes / Math.pow(1024, Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3))).toFixed(1) + ' ' + u[Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3)]
}

function platformColor(p: string) {
  const m: Record<string, string> = { youtube: '#ef4444', tiktok: '#f472b6', instagram: '#a855f7', facebook: '#2563eb' }
  return m[p] || '#d2bbff'
}
</script>
