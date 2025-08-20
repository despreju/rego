import { defineStore } from 'pinia'
import { setAccessToken, removeAccessToken } from '../utils/auth';
import router from '../router';

export interface auth {
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false as boolean,
  }),

  actions: {
    login(token: string) {
        this.isAuthenticated = true
        setAccessToken(token);
        router.push('/')
    },
    logout() {
        this.isAuthenticated = false
        removeAccessToken();
        router.push('/login')
    },
    check() {
        this.isAuthenticated = true
        router.push('/')
    },
    initFromStorage() {
      const t = localStorage.getItem('rego-token')
      if (t) {
        this.isAuthenticated = true
      } else {
        this.isAuthenticated = false
      }
    }
  },
})