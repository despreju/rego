<template>
    <Panel>
        <div class="switch-site-panel">
            <div v-if="!addSite">
                <div class="topbar-switch">
                    <div class="title">Choisissez le site sur lequel vous souhaitez travailler</div>
                    <Button class="button-action" color="blue" @click="addSite = true" :icon="addIcon"
                        msg="Créer un site" style="margin-left: 4rem"/>
                </div>

                <div v-for="(site, index) in sites" :key="index">
                    <Button class="button-action" color="accent" :msg="site" style="margin-right: 5rem"
                        @click="switchToSite(site)" />
                </div>
            </div>
            <div v-if="addSite" style="padding: 2rem 6rem">
                <div class="title" style="margin-bottom: 2rem;">Créer un nouveau site</div>
                <div v-if="!isLoading"><Input placeholder="Nom du site" v-if="addSite" type="text" v-model="siteName"
                        style="margin-bottom: 2rem" />
                    <Button class="button-action" color="green" msg="Créer" style="margin-right: 5rem"
                        @click="handleCreateSite" />
                    <Button class="button-action" color="red" msg="Annuler" @click="addSite = false" />
                </div>
                <div v-else>Loading">
                    <loading />
                </div>
            </div>
            <div v-if="loadingData">
                Chargement des données...
            </div>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Panel from './Panel.vue';
import { fetchSites, createSite } from '../api/siteApi';
import { useAuthStore } from '../stores/auth';
import { useSiteStore } from '../stores/site';
import Button from './Button.vue';
import Input from './Input.vue';
import addIcon from '../assets/icons/add.svg';
import loading from '../assets/icons/loading.svg';
import { useToast } from '../composables/useToast';
import { useError } from '../composables/useError.ts'
import type { ApiError } from '../api/axios.ts';
import type { Site } from '../types/index.ts';
import { getOrders } from '../api/orderApi.ts';
import { getUsers } from '../api/authApi.ts';

const { handleApiError } = useError()  
const apiErr = ref<ApiError | null>(null)

const authStore = useAuthStore();
const siteStore = useSiteStore();
const addSite = ref(false);
const loadingData = ref(false);
const siteName = ref('');
const sites = ref<string[]>([]);
const isLoading = ref(false);
const emit = defineEmits(['close'])

const handleCreateSite = async () => {
    isLoading.value = true;
    try {
        await createSite(siteName.value, authStore.user._id)
        await fetchSites(authStore.user._id)
        const { showToast } = useToast()
        showToast('Site créé', 'success')
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
        isLoading.value = false
        addSite.value = false
    }
};

const switchToSite = async (siteName: string) => {
    siteStore.setSite(siteName);
    await getSiteData()
    loadingData.value = true;
    emit('close');
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
    await fetchSites(authStore.user._id).then((res) => {
        sites.value = res.map((site: Site) => (site.name));
    }).catch((error) => {
        console.error('Error fetching sites:', error);
    });
});
</script>

<style scoped>
.switch-site-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.topbar-switch {
    display: flex;
    justify-content: center;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.title {
    color: var(--color-text);
    font-size: 1.5rem;
}

.site {
    background-color: var(--color-accent);
    color: var(--color-bg);
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 1.25rem;
    cursor: pointer;
}
</style>