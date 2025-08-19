<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup>
import AuthLayout from './layouts/AuthLayout.vue'
import MainLayout from './layouts/MainLayout.vue'
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const layoutComponent = computed(() => {
  if (route.meta.layout === 'login') return AuthLayout
  return MainLayout
})
</script>