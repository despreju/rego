<template>
  <MainLayout>
    <h1>Home</h1>
    <button @click="onLogout">Logout</button>
  </MainLayout>  
</template>

<script setup lang="ts">
    import { useLogout } from '../composables/useAuth';

  const logoutMutation = useLogout();

  const onLogout = () => {
    logoutMutation.mutate();
  };
</script>

<style scoped>
/* Ton style ici */
</style>