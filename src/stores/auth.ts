import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, logout as apiLogout, checkAuth } from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref('Admin')

  async function login(username: string, password: string) {
    const res = await apiLogin(username, password)
    token.value = res.token
    user.value = username
    localStorage.setItem('token', res.token)
  }

  async function logout() {
    await apiLogout()
    token.value = null
    localStorage.removeItem('token')
  }

  async function check() {
    if (!token.value) return false
    try {
      await checkAuth()
      return true
    } catch {
      token.value = null
      localStorage.removeItem('token')
      return false
    }
  }

  return { token, user, login, logout, check }
})
