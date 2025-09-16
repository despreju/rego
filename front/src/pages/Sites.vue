<template>
    <div v-for="site in allSites" :key="site._id">{{ site.name }}</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useError } from '../composables/useError.ts'
import type { ApiError } from '../api/axios.ts';
import type { Site } from '../types/index.ts';
import { getAllSites } from '../api/siteApi.ts';

const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const allSites = ref<Site[]>([]);

onMounted(async () => {
    try {
        const response = await getAllSites()
        allSites.value = response
    } catch (e) {
        apiErr.value = handleApiError(e)
    }
});
</script>

<style scoped>
</style>