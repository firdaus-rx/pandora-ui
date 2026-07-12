import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLibrary, getLibraryPlaylist, deleteTrack as apiDeleteTrack } from '@/api/client'

export const useLibraryStore = defineStore('library', () => {
  const tracks = ref<any[]>([])
  const groups = ref<Record<string, any>>({})
  const stats = ref({ total: 0, totalBytes: 0, platforms: 0 })
  const loading = ref(false)

  async function fetchAll(params?: any) {
    loading.value = true
    try {
      const res = await getLibrary(params)
      tracks.value = res.groups ? Object.values(res.groups).flatMap((g: any) => g.tracks) : []
      groups.value = res.groups || {}
      stats.value = { total: res.total, totalBytes: res.totalBytes, platforms: res.platforms }
    } finally {
      loading.value = false
    }
  }

  async function fetchPlaylist(platform: string, playlist: string) {
    return getLibraryPlaylist(platform, playlist)
  }

  async function deleteTrack(id: string) {
    await apiDeleteTrack(id)
    await fetchAll()
  }

  return { tracks, groups, stats, loading, fetchAll, fetchPlaylist, deleteTrack }
})
