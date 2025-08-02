<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <h2>Utilisateurs</h2>
    <NButton type="primary" @click="fetch">Charger les utilisateurs</NButton>
    <div v-if="isLoading">Chargement...</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.login }} – {{ user.id }}
      </li>
    </ul>
    <div v-if="error">Erreur : {{ error }}</div>
  </div>

</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useUserStore } from '../stores/user'
import { useFetchUsers } from '../api/userApi'
import { storeToRefs } from 'pinia'

defineProps<{ msg: string }>()
const userStore = useUserStore()
const { users } = storeToRefs(userStore)
  
const { fetch, isLoading, error } = useFetchUsers()

</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
