<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
  <Toast />
</template>

<script setup lang="ts">
import Toast from './components/Toast.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import MainLayout from './layouts/MainLayout.vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';

const route = useRoute()
const auth = useAuthStore()
const layoutComponent = computed(() => {
  if (!auth.isAuthenticated || route.meta.layout === 'login') return AuthLayout
  return MainLayout
})
</script>