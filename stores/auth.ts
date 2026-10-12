// client/stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
}

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  if (import.meta.client) {
    token.value = localStorage.getItem('token')
  }

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: { email: string; password: string }) {
    try {
      const response = await $fetch<{ token: string; user: User }>(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: credentials
      })

      token.value = response.token
      user.value = response.user

      if (import.meta.client) {
        localStorage.setItem('token', response.token)
      }

      await navigateTo('/dashboard')
      return response
    } catch (error: any) {
      console.error('Erreur de connexion:', error.data || error.message)
      throw error
    }
  }

  async function register(userData: { firstName: string; lastName: string; email: string; password: string }) {
    try {
      const response = await $fetch<{ token: string; user: User }>(`${config.public.apiBase}/auth/register`, {
        method: 'POST',
        body: userData
      })

      token.value = response.token
      user.value = response.user

      if (import.meta.client) {
        localStorage.setItem('token', response.token)
      }

      await navigateTo('/dashboard')
      return response
    } catch (error: any) {
      console.error("Erreur d'inscription:", error.data || error.message)
      throw error
    }
  }

  function logout() {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('token')
    }
    navigateTo('/login')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  }
})