<template>
  <n-layout class="min-h-screen flex items-center justify-center bg-gray-100">
    <n-card
      class="w-full max-w-md"
      title="Connexion"
      size="medium"
      bordered
    >
      <slot />
    </n-card>
  </n-layout>
</template>

<script lang="ts" setup>
import { NLayout, NCard } from 'naive-ui'
</script>