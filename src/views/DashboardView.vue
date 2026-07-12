<template>
  <div class="px-4 lg:px-6 pt-4 lg:pt-6 pb-24 lg:pb-8">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl lg:text-[32px] font-semibold tracking-tight" style="color: #0f172a;">Dasbor</h2>
        <p class="text-sm lg:text-base" style="color: #64748b;">Selamat datang. Semua sistem berjalan lancar.</p>
      </div>
      <router-link to="/chat" class="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all text-white shadow-lg" style="background: linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%); box-shadow: 0 4px 16px rgba(239,68,68,0.2);">
        <span class="material-symbols-outlined text-base">bolt</span>
        <span class="hidden sm:inline">Download Baru</span>
      </router-link>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
      <div v-for="card in statCards" :key="card.label" class="p-4 lg:p-6 rounded-2xl accent-box" style="background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <p class="text-[10px] lg:text-xs font-semibold uppercase tracking-widest mb-1" style="color: #94a3b8;">{{ card.label }}</p>
        <h3 class="text-2xl lg:text-4xl font-black" style="color: #0f172a;">{{ card.value }}</h3>
        <p class="text-xs mt-1" style="color: #64748b;">{{ card.sub }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div class="xl:col-span-8 rounded-2xl overflow-hidden" style="background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div class="p-4 lg:p-6 flex justify-between items-center" style="border-bottom: 1px solid #e2e8f0;">
          <h4 class="text-sm lg:text-lg font-medium" style="color: #0f172a;">Download Terbaru</h4>
          <router-link to="/library" style="color: #ef4444;" class="text-xs font-medium transition-colors">Lihat Semua</router-link>
        </div>
        <div>
          <div v-for="track in recentTracks" :key="track.id" @click="goToPlayer(track.id)" class="flex items-center gap-3 px-4 lg:px-6 py-3 transition-colors cursor-pointer" style="border-bottom: 1px solid #f1f5f9;">
            <div class="w-10 h-7 lg:w-14 lg:h-10 rounded-lg overflow-hidden shrink-0" style="background: #f1f5f9;">
              <img v-if="track.thumbnail" :src="track.thumbnail" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center"><span class="material-symbols-outlined text-sm" style="color: #94a3b8;">music_note</span></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs lg:text-sm font-medium truncate" style="color: #0f172a;">{{ track.title }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="w-1 h-1 rounded-full" :style="{ backgroundColor: platformColor(track.platform) }"></span>
                <span class="text-[10px] lg:text-xs capitalize truncate" style="color: #64748b;">{{ track.platform }}</span>
                <span class="px-1 py-0.5 rounded text-[9px] lg:text-[10px] font-mono uppercase" style="background: #fef2f2; color: #ef4444; border: 1px solid #fecaca;">{{ track.format }}</span>
                <span class="text-[10px] ml-auto hidden sm:inline" style="color: #94a3b8;">{{ timeAgo(track.downloadedAt) }}</span>
              </div>
            </div>
          </div>
          <div v-if="recentTracks.length === 0" class="px-6 py-10 text-center text-sm" style="color: #94a3b8;">
            <span class="material-symbols-outlined text-3xl mb-2 block" style="color: #94a3b8;">inbox</span>
            Belum ada download.
          </div>
        </div>
      </div>

      <div class="xl:col-span-4">
        <div class="p-4 lg:p-6 rounded-2xl accent-box" style="background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <h4 class="text-sm lg:text-lg font-medium mb-4" style="color: #0f172a;">Distribusi Platform</h4>
          <div class="space-y-4">
            <div v-for="p in platformDist" :key="p.name" class="flex items-center gap-3">
              <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-sm" :style="{ background: p.bgColor }">
                <span class="material-symbols-outlined text-base lg:text-lg" style="font-variation-settings: 'FILL' 1; color: p.color;">{{ p.icon }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between text-xs">
                  <span class="font-medium capitalize truncate" style="color: #0f172a;">{{ p.name }}</span>
                  <span style="color: #64748b;">{{ p.percent }}%</span>
                </div>
                <div class="w-full h-1.5 rounded-full mt-1" style="background: #f1f5f9;">
                  <div class="h-full rounded-full" :style="{ width: p.percent + '%', background: 'linear-gradient(90deg, #ef4444, #8b5cf6)' }"></div>
                </div>
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
import { useRouter } from 'vue-router'
import { getLibrary } from '@/api/client'

const router = useRouter()
const stats = ref<any>({ total: 0, platforms: 0, sizeFormatted: '0 B' })
const tracks = ref<any[]>([])

const recentTracks = computed(() => tracks.value.slice(0, 5))

const statCards = computed(() => [
  { label: 'Download', value: stats.value.total, sub: `${stats.value.platforms} platform` },
  { label: 'Penyimpanan', value: stats.value.sizeFormatted || '0 B', sub: 'Terpakai' },
  { label: 'Platform', value: Object.keys(platformCounts.value).length || stats.value.platforms, sub: 'Terintegrasi' },
  { label: 'Playlist', value: playlistCount.value, sub: 'Terorganisir' },
])

const platformDist = computed(() => {
  const c: Record<string, number> = {}
  for (const t of tracks.value) { const p = t.platform || 'other'; c[p] = (c[p] || 0) + 1 }
  const total = Object.values(c).reduce((a, b) => a + b, 0) || 1
  const colors: Record<string, any> = { youtube: { bgColor: '#fef2f2', color: '#ef4444', icon: 'smart_display' }, tiktok: { bgColor: '#eff6ff', color: '#3b82f6', icon: 'movie' }, instagram: { bgColor: '#fdf2f8', color: '#ec4899', icon: 'camera' }, facebook: { bgColor: '#eff6ff', color: '#2563eb', icon: 'face_nod' } }
  return Object.entries(c).map(([name, count]) => ({ name, percent: Math.round((count / total) * 100), ...(colors[name] || { bgColor: '#f5f3ff', color: '#8b5cf6', icon: 'download' }) }))
})
const platformCounts = computed(() => { const c: Record<string, number> = {}; for (const t of tracks.value) c[t.platform] = (c[t.platform] || 0) + 1; return c })
const playlistCount = computed(() => new Set(tracks.value.map((t: any) => `${t.platform}:${t.playlist}`)).size)

onMounted(async () => { try { const res = await getLibrary(); stats.value = res; tracks.value = res.groups ? Object.values(res.groups).flatMap((g: any) => g.tracks || []) : [] } catch {} })
function goToPlayer(id: string) { router.push(`/library/${id}`) }
function timeAgo(date: string) { const d = new Date(date); const m = Math.floor((Date.now() - d.getTime()) / 60000); if (m < 60) return `${m}m`; const h = Math.floor(m / 60); if (h < 24) return `${h}j`; return `${Math.floor(h / 24)}h` }
function platformColor(p: string) { const m: Record<string, string> = { youtube: '#ef4444', tiktok: '#f472b6', instagram: '#a855f7', facebook: '#2563eb' }; return m[p] || '#8b5cf6' }
</script>

<style scoped>
.accent-box { position: relative; }
.accent-box::before { content: ''; position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px; border: 1px solid rgba(239,68,68,0.08); border-radius: inherit; pointer-events: none; }
</style>
