import { defineStore } from 'pinia'
import { setAccessToken, removeAccessToken } from '../utils/auth';
import router from '../router';
import type { User } from '../types';

export type { User };

export const useAuthStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false as boolean,
    user: {} as User,
    users: [] as Array<User>
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
        localStorage.removeItem('rego-site');
        router.push('/login')
    },
    check(user: User) {
        this.isAuthenticated = true
        this.user = user
    },
    getUsers(users: Array<User>) {
        this.users = users
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