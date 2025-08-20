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
import { logout } from '../api/authService';
import { useAuthStore } from '../stores/auth';
import { getOrders } from '../api/orderService';
import { useOrderStore } from '../stores/order';

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

onMounted(() => {
  getOrders().then(orders => {
    const order = useOrderStore()
    order.saveOrders(orders);
  }).catch(error => {
    console.error('Error fetching orders:', error);
  });
});
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

.sidebar {
  width: auto;
  background: #1C1B20;
  color: #F0F1F8;
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
  background-color: #1C1B20;
}

.menu:hover {
  background-color: rgb(53, 54, 66);
  transition: background-color 0.15s ease-in-out;
}

.-open>div.menu>.menu-title {
  width: 162px;
  transition: width 0.15s ease-in-out;
  text-align: left;
}

.menu-icon {
  width: 48px;
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