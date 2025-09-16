<template>
    <Panel>
        <div class="panel-title"> {{ title }}</div>
        <div class="new-order-panel__row">
            <Input class="order-input" label="Prénom" type="text" placeholder="John" v-model="formUser.firstname" />
            <span style="width:10%"></span>
            <Input class="order-input" label="Nom" type="text" placeholder="Doe" v-model="formUser.name" />
        </div>
        <div class="new-order-panel__row">
            <Input class="order-input" label="Login" type="text" placeholder="JohnDoe" v-model="formUser.login" />
            <span style="width:10%"></span>
            <Input class="order-input" label="Email" type="text" placeholder="john@doe.com" v-model="formUser.email" />
        </div>
        
        <div style="margin-top: auto;">
            <div class="actions-bar">
                <Button color="green" @click="onUpdateOrder" v-if="!isLoading && auth.user.level === 'admin'" msg="Mettre à jour" />
                <Button color="grey" @click="emit('close')" v-if="!isLoading" msg="Annuler" />
                <Loading v-else />
            </div>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import Loading from '../assets/icons/loading.svg';
import { ref } from 'vue'
import { updateUser, check } from '../api/authApi.ts';
import { useError } from '../composables/useError.ts'
import type { ApiError } from '../api/axios.ts';
import Panel from './Panel.vue';
import type { User } from '../types/index.ts';
import { useToast } from '../composables/useToast.ts';
import { useAuthStore } from '../stores/auth.ts';

const auth = useAuthStore();
const props = defineProps<{ user: User }>()

const emit = defineEmits(['close'])
const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const isLoading = ref(false);

const formUser = ref<{
    login: string,
    email: string,
    name: string,
    firstname: string
}>({
    login: props.user?.login || '',
    email: props.user?.email || '',
    name: props.user?.name || '',
    firstname: props.user?.firstname || ''
});

const onUpdateOrder = async () => {
    isLoading.value = true;
    try {
        await updateUser({
            login: formUser.value.login,
            email: formUser.value.email,
            name: formUser.value.name,
            firstname: formUser.value.firstname,
        })
        await check()
        const { showToast } = useToast()
        showToast('Profil mis à jour', 'success')
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
        isLoading.value = false
        emit('close')
    }
}

const title = ref<string>('Modifier mon profil')
</script>

<style scoped>
.new-order-panel__row {
    display: flex;
    width: 100%;
}

.panel-title {
    font-size: 1.5rem;
    color: var(--color-text);
    margin-bottom: 3rem;
}

.actions-bar {
    display: flex;
    justify-content: space-around;
}

.order-input {
    margin-bottom: 2rem;
}
</style>