const BASE = (import.meta as any).env?.VITE_API_URL || '/api'

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data as T
}

export function login(username: string, password: string) {
  return request<{ ok: boolean; token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function logout() {
  return request<{ ok: boolean }>('/logout', { method: 'POST' })
}

export function checkAuth() {
  return request<{ ok: boolean }>('/auth/check')
}

export function getLibrary(params?: {
  platform?: string
  format?: string
  playlist?: string
  q?: string
  id?: string
}) {
  const qs = params ? '?' + new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))).toString() : ''
  return request<any>(`/library${qs}`)
}

export function getLibraryPlaylist(platform: string, playlist: string) {
  return request<any>(`/library/${encodeURIComponent(platform)}/${encodeURIComponent(playlist)}`)
}

export function deleteTrack(id: string) {
  return request<{ ok: boolean; totalDownloads: number }>(`/library/${id}`, { method: 'DELETE' })
}

export function chat(message: string, sessionId?: string) {
  return request<{ sessionId: string; command: any; results: any[] }>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, sessionId }),
  })
}

export function getChatSessions() {
  return request<{ sessions: any[] }>('/chat/sessions')
}

export function getChatSession(id: string) {
  return request<{ session: any }>(`/chat/session/${id}`)
}

export function getSettings() {
  return request<{ vars: Record<string, string> }>('/settings')
}

export function updateSettings(updates: Record<string, string>) {
  return request<{ ok: boolean }>('/settings', {
    method: 'PUT',
    body: JSON.stringify({ updates }),
  })
}

export function getSystem() {
  return request<any>('/system')
}

function withToken(path: string): string {
  const token = localStorage.getItem('token')
  return `${BASE}${path}${path.includes('?') ? '&' : '?'}token=${token}`
}

export function getStreamUrl(id: string) {
  return withToken(`/stream/${id}`)
}

export function getDownloadUrl(id: string) {
  return withToken(`/download/${id}`)
}
