import { defineStore } from 'pinia'

export interface auth {
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false as boolean,
  }),

  actions: {
    login() {
        this.isAuthenticated = true
    },
    logout() {
        this.isAuthenticated = false
    },
  },
})