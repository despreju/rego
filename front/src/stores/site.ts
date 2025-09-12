import { defineStore } from 'pinia'
import type { Site } from '../types';

export const useSiteStore = defineStore('site', {
  state: () => ({
    currentSite: {} as Site,
  }),

  actions: {
    setSite(site: Site) {
      this.currentSite = site;
    },
  },
})