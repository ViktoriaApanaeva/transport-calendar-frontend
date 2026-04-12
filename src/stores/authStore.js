import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  
  actions: {
    setAuth(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    
    clearAuth() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },
    
    async login(credentials) {
      try {
        const response = await axios.post(`${API_URL}/api/account/login`, credentials)
        if (response.data.success) {
          this.setAuth(response.data.token, response.data.user)
          return { success: true }
        }
        return { success: false, error: response.data.message }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: error.response?.data?.message || 'Ошибка подключения к серверу' }
      }
    },
    
    logout() {
      this.clearAuth()
    }
  }
})