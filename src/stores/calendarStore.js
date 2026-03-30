import { defineStore } from 'pinia'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    events: [],
    loading: false
  }),
  
  actions: {
    async fetchEvents(start, end) {
      this.loading = true
      try {
        const response = await axios.get(`${backendUrl}/api/CalendarApi`, {
          params: { start: start.toISOString(), end: end.toISOString() }
        })
        this.events = response.data
        return this.events
      } catch (error) {
        console.error('Ошибка загрузки:', error)
        return []
      } finally {
        this.loading = false
      }
    }
  }
})