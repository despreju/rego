<template>
  <n-layout class="min-h-screen" has-sider>
    <n-layout-sider width="200" bordered>
      <div class="p-4 font-bold text-xl">MonApp</div>
      <n-menu :options="menuOptions" @update:value="handleMenuSelect" />
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered class="p-4 flex justify-between items-center">
        <div class="text-lg font-semibold">Dashboard</div>
        <n-button quaternary type="error" @click="logout">Déconnexion</n-button>
      </n-layout-header>

      <n-layout-content class="p-6">
        <slot />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutSider,
  NButton,
  NMenu
} from 'naive-ui'

import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const menuOptions = [
  {
    label: 'Accueil',
    key: 'home'
  },
  {
    label: 'Profil',
    key: 'profile'
  }
]

const handleMenuSelect = (key: string) => {
  router.push(`/${key}`)
}
</script>
