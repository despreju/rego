<template>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const showSider = ref(false)
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style>
.navbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  min-height: 56px;
  background: #fff;
}
.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.navbar-center {
  flex: 1; 
  text-align: center;
}
.rego-layout {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;
}
.n-drawer-header__main {
  display: flex; 
  justify-content: flex-end; 
  align-items: center;
}
</style>