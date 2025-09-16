<template>
    <Panel>
        <div class="switch-site-panel">
            <div v-if="!addSite">
                <div class="topbar-switch" v-if="!loadingData">
                    <div class="title">Choisissez le site sur lequel vous souhaitez travailler</div>
                    
                </div>
                <div class="topbar-loading" v-else>
                    <div class="title">{{ siteLoading }}</div>
                    <div>Récupération des commandes
                        <loading v-if="order.orderLoading" style="width: 40px; margin-left: 4rem" />
                        <success v-else style="fill: var(--color-success); width: 40px; margin-left: 4rem" />
                    </div>
                    <div>Récupération des utilisateurs
                        <loading v-if="loadingUsers" style="width: 40px; margin-left: 4rem" />
                        <success v-else style="fill: var(--color-success); width: 40px; margin-left: 4rem" />
                    </div>
                    <div>Préparation de l'interface
                        <loading v-if="loadingUI" style="width: 40px; margin-left: 4rem" />
                        <success v-else style="fill: var(--color-success); width: 40px; margin-left: 4rem" />
                    </div>
                </div>
                <div v-if="!loadingData" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem;">
                    <div v-for="(site, index) in sites" :key="index">
                        <Button class="button-action" color="accent" :msg="site.name"
                            @click="switchToSite(site)" />
                    </div>
                    <Button class="button-action" color="blue" @click="addSite = true" :icon="addIcon"
                        msg="Créer un site"/>
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
        </div>
    </Panel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Panel from './Panel.vue';
import { fetchSites, createSite } from '../api/siteApi';
import { useAuthStore } from '../stores/auth';
import { useOrderStore } from '../stores/order';
import { useSiteStore } from '../stores/site';
import Button from './Button.vue';
import Input from './Input.vue';
import addIcon from '../assets/icons/add.svg';
import loading from '../assets/icons/loading.svg';
import success from '../assets/icons/success.svg';
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
const order = useOrderStore();
const addSite = ref(false);
const loadingData = ref(false);
const siteName = ref('');
const sites = ref<Site[]>([]);
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

const loadingOrders = ref(true);
const loadingUsers = ref(true);
const loadingUI = ref(true);

const switchToSite = async (site: Site) => {
    localStorage.setItem('rego-site', site.name);
    siteLoading.value = site.name;
    loadingData.value = true;
    siteStore.setSite(site);
    await getSiteData()
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

const siteLoading = ref('load');

const getSiteData = async () => {
    try {
        await fetchOrders()
        loadingOrders.value = false;
        await fetchUsers()
        loadingUsers.value = false;
        // Simulate UI preparation delay
        await new Promise(resolve => setTimeout(resolve, 100));
        loadingUI.value = false;
        loadingData.value = false;
    } catch (e) {
        apiErr.value = handleApiError(e)
    }
};

onMounted(async () => {
    await fetchSites(authStore.user._id).then((res) => {
        if (res.length === 1) {
            switchToSite(res[0]);
        } else {
            sites.value = res.map((site: Site) => (site));
        }
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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.topbar-loading {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.topbar-loading>div {
    height: 4rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-text)
}

.title {
    color: var(--color-text);
    font-size: 1.5rem;
}

.site {
    margin-bottom: 2rem;
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