<template>
  <div class="main-layout">
    <div>
      <div class="top-bar">
        <div class="app-title">
          <img src="../assets/rego.png" alt="logo" class="logo"> | Order Management
        </div>
        <div class="user">
          <div class="user-logo">{{ userStore.user.firstname[0] + userStore.user.name[0] }}</div>
          <div class="user-profile">{{ userStore.user.firstname + ' ' + userStore.user.name }}</div>
        </div>
      </div>
      <div class="wrapper">
        <div class="sidebar">
          <div class="sidebar-title">MENU PRINCIPAL</div>
          <div class="menu" @click="goTo('/home')">
            <home class="menu-icon" />
            <div class="menu-title">Accueil</div>
          </div>
          <!-- <div class="menu">
          <users class="menu-icon" />
          <div class="menu-title">Utilisateurs</div>
        </div> -->
          <div class="menu" @click="goTo('/orders')">
            <orders class="menu-icon" />
            <div class="menu-title">Commandes</div>
          </div>
          <div class="menu" @click="onSubmitLogout">
            <profile class="menu-icon" />
            <div class="menu-title">Profile</div>
          </div>
        </div>
        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import profile from '../assets/icons/profile.svg';
import orders from '../assets/icons/orders.svg';
import home from '../assets/icons/home.svg';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { logout } from '../api/authApi';
import { useAuthStore } from '../stores/auth';
import { getOrders } from '../api/orderApi';
import { useError } from '../composables/useError'
import type { ApiError } from '../api/axios';

const userStore = useAuthStore();

const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const router = useRouter();

const onSubmitLogout = () => {
  logout().then(() => {
    const authStore = useAuthStore()
    authStore.logout()
  });
};

const goTo = (path: string) => {
  router.push(path);
};

const fetchOrders = async () => {
  try {
    await getOrders()
  } catch (e) {
    apiErr.value = handleApiError(e)
  }
};

onMounted(async () => {
  await fetchOrders()
});
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

.sidebar {
  width: 16rem;
  background: var(--color-surface);
  color: var(--color-text);
  height: 100vh;
  position: fixed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
}

.sidebar-title {
  margin-top: 2rem;
  margin-left: 1.2rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: left;
}

.menu {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.menu:hover {
  background-color: var(--color-surface-hover);
  transition: background-color 0.15s ease-in-out;
}

.menu-icon {
  width: 32px;
  margin: 1rem;
}

.menu-title {
  white-space: nowrap;
  text-align: left;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-surface);
  color: var(--color-text);
  height: 4rem;
  box-shadow: 0px 1px 3px 0px var(--color-surface);
  z-index: 50;
  position: relative;
}

.app-title {
  color: var(--color-text);
  font-weight: bold;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
}

.logo {
  width: 70px;
}

.wrapper {
  z-index: 2;
}

.content {
  margin-left: 16rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5rem;
}

.user {
  display: flex;
  align-items: center;
}

.user-logo {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-bg);
  font-weight: bold;
  margin-right: 1.5rem;
}

.user-profile {
  color: var(--color-text);
  margin-right: 2rem;
}
</style>