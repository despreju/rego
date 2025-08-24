import { defineStore } from 'pinia'
import { setAccessToken, removeAccessToken } from '../utils/auth';
import router from '../router';
import type { User } from '../types';

export const useAuthStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false as boolean,
    user: {} as User
  }),

  actions: {
    login(token: string, user: User) {
        this.isAuthenticated = true
        this.user = user
        setAccessToken(token);
        router.push('/')
    },
    logout() {
        this.isAuthenticated = false
        removeAccessToken();
        router.push('/login')
    },
    check(user: User) {
        this.isAuthenticated = true
        this.user = user
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