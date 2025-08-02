import { defineStore } from 'pinia'

export interface User {
  id: number
  login: string
  email: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    setUsers(users: User[]) {
      this.users = users
    },
    setLoading(val: boolean) {
      this.loading = val
    },
    setError(message: string | null) {
      this.error = message
    },
  },
})