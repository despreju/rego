<template>
  <div class="main-layout">
    <div>
      <div :class="sidebarClass">
        <div class="menu">
          <burgerMenu class="menu-icon" @click="toggleSidebar" />
        </div>
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
        <div style="color: red">user :{{ userStore.user?.email }} - id : {{ userStore.user?._id }}</div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import burgerMenu from '../assets/icons/burgerMenu.svg';
import profile from '../assets/icons/profile.svg';
import orders from '../assets/icons/orders.svg';
import home from '../assets/icons/home.svg';
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { logout } from '../api/authApi';
import { useAuthStore } from '../stores/auth';
import { getOrders } from '../api/orderApi';
import { useError } from '../composables/useError'
import type { ApiError } from '../api/axios';

const userStore = useAuthStore();

const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const isSidebarOpen = ref(false)

const sidebarClass = computed(() => ({
  sidebar: true,
  '-open': isSidebarOpen.value
}))

const toggleSidebar = () => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.toggle('-open');
  }
};

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
  width: auto;
  background: var(--color-surface);
  color: var(--color-text);
  height: 100vh;
  position: fixed;
  transition: width 0.15s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
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

.-open>div.menu>.menu-title {
  width: 162px;
  transition: width 0.15s ease-in-out;
  text-align: left;
}

.menu-icon {
  width: 40px;
  margin: 1.5rem;
}

.menu-title {
  width: 0;
  overflow: hidden;
  transition: width 0.15s ease-in-out;
  white-space: nowrap;
  text-align: left;
}

.sidebar>div:last-child {
  margin-top: auto;
}

.content {
  margin-left: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5%;
}
</style>