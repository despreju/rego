import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  state: () => ({
    currentSite: undefined as String | undefined,
  }),

  actions: {
    setSite(siteName: String) {        
        this.currentSite = siteName;
    },
  },
})