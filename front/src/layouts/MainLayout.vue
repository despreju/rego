<template>
  <SwitchSitePanel v-if="switchSiteIsOpen" @close="switchSiteIsOpen = false" />
  <EditProfilePanel :user="userStore.user" v-if="isEditProfilePanelOpen" @close="isEditProfilePanelOpen = false" />
  <div class="main-layout">
    <div>
      <div class="top-bar">
        <div class="app-title">
          <img src="../assets/rego.png" alt="logo" class="logo"> | Order Management
        </div>
        <div class="user" @click="isEditProfilePanelOpen = true">
          <div class="user-logo">{{ userStore.user.firstname[0] + userStore.user.name[0] }}</div>
          <div class="user-profile">{{ userStore.user.firstname + ' ' + userStore.user.name }}
          </div>
        </div>
      </div>
      <div class="wrapper">
        <div class="sidebar">
          <div class="current-site" @click="switchSiteIsOpen = true">{{ siteStore.currentSite.name }}<Switch /></div>
          <div class="sidebar-title">MENU PRINCIPAL</div>
          <div class="menu" @click="goTo('/home')">
            <home class="menu-icon" />
            <div class="menu-title">Accueil</div>
          </div>
          <div class="menu" @click="goTo('/orders')">
            <orders class="menu-icon" />
            <div class="menu-title">Commandes</div>
            <Badge class="menu-badge" type="primary">{{ order.ordersList.length }}</Badge>
          </div>
          <div class="menu" @click="goTo('/shopify')">
            <shopify class="menu-icon" />
            <div class="menu-title">Paiement Shopify</div>
            <Badge class="menu-badge" type="primary">{{ order.shopifyList.length }}</Badge>
          </div>
          <div class="menu" @click="goTo('/ads')">
            <ad class="menu-icon" />
            <div class="menu-title">Dépenses diverses</div>
            <Badge class="menu-badge" type="primary">{{ order.adsList.length }}</Badge>
          </div>
          <div class="sidebar-subtitle">GESTION INTERNE</div>
          <div class="menu" @click="goTo('/users')">
            <users class="menu-icon" />
            <div class="menu-title">Utilisateurs</div>
            <Badge class="menu-badge" type="accent">{{ userStore.users.length }}</Badge>
          </div>
          <div class="menu" @click="goTo('/payment')">
            <money class="menu-icon" />
            <div class="menu-title">Versement</div>
            <Badge class="menu-badge" type="accent">{{ order.paymentsList.length }}</Badge>
          </div>
          <div class="menu" @click="onSubmitLogout">
            <logoutIcon class="menu-icon" style="fill: none;" />
            <div class="menu-title">Se déconnecter</div>
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
import orders from '../assets/icons/orders.svg';
import home from '../assets/icons/home.svg';
import logoutIcon from '../assets/icons/logout.svg';
import shopify from '../assets/icons/home.svg';
import money from '../assets/icons/money.svg';
import users from '../assets/icons/users.svg';
import ad from '../assets/icons/ad.svg';
import Badge from '../components/Badge.vue';
import Switch from '../assets/icons/Switch.svg';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { getUsers, logout } from '../api/authApi';
import { useAuthStore } from '../stores/auth';
import { useOrderStore } from '../stores/order'
import { useSiteStore } from '../stores/site';
import { getOrders } from '../api/orderApi';
import { useError } from '../composables/useError'
import type { ApiError } from '../api/axios';
import EditProfilePanel from '../components/EditProfilePanel.vue';
import SwitchSitePanel from '../components/SwitchSitePanel.vue';

const userStore = useAuthStore();
const order = useOrderStore()
const siteStore = useSiteStore()

const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const isEditProfilePanelOpen = ref(false)
const switchSiteIsOpen = ref(false)

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

const fetchUsers = async () => {
  try {
    await getUsers()
  } catch (e) {
    apiErr.value = handleApiError(e)
  }
};

const getSiteData = async () => {
  try {
    await fetchOrders()
    await fetchUsers()
  } catch (e) {
    apiErr.value = handleApiError(e)
  }
};

onMounted(async () => {
  if (sessionStorage.getItem('rego-site')) {
    await getSiteData()
  } else {
    switchSiteIsOpen.value = true;
  }
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

.current-site {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--color-surface);
  cursor: pointer;
}

.current-site:hover {
  background: var(--color-surface-hover);
}

.current-site>svg {
  width: 24px;
  fill: var(--color-text);
}

.sidebar-title {
  margin-top: 2rem;
  margin-left: 1.2rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: left;
}

.sidebar-subtitle {
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
  position: relative;
}

.menu:hover {
  background-color: var(--color-surface-hover);
  transition: background-color 0.15s ease-in-out;
}

.menu-icon {
  width: 32px;
  margin: 1rem;
  fill: var(--color-text)
}

.menu-title {
  white-space: nowrap;
  text-align: left;
}

.menu-badge {
  right: 1rem;
  left: auto;
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
  padding: 1rem;
  height: 100%
}

.user:hover {
  background-color: var(--color-surface-hover);
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
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