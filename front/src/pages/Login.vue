<template>
    <form class="login-form">
        <img src="../assets/rego.png" alt="logo">
        <div class="login-title">Bienvenue !</div>
        <div class="login-subtitle">Entre votre login et votre mot de passe pour entrer dans votre espace de travail.
        </div>
        <div class="input">
            <Input dark class="login-input" type="text" label="Identifiant" v-model="loginForm.login" required
                placeholder="Identifiant" />
        </div>
        <div class="input">
            <Input dark class="login-input" type="password" label="Mot de passe" v-model="loginForm.password" required
                placeholder="Mot de passe" />
        </div>
        <div class="button">
            <Button color="blue" @click.prevent="onSubmitLogin" v-if="!isLoading" msg="Se connecter" style="width: 100%;"/>
            <Loading v-else />
        </div>
        <!--<Button color="blue" @click.prevent="onSubmitSignin" v-if="!isLoading" msg="Se connecter"/>-->
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../api/authApi';
import { useAuthStore } from '../stores/auth';
import Loading from '../assets/icons/loading.svg';
import { useError } from '../composables/useError'
import type { ApiError } from '../api/axios';
import { useToast } from '../composables/useToast'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'

const { handleApiError } = useError()
const apiErr = ref<ApiError | null>(null)

const isLoading = ref(false);
const loginForm = ref({ login: '', password: '' });

const onSubmitLogin = async () => {
    isLoading.value = true;
    try {
        const response = await login({ login: loginForm.value.login, password: loginForm.value.password })
        const { showToast } = useToast()
        showToast('Connexion réussie', 'success')
        const authStore = useAuthStore()
        console.log(response)
        authStore.login(response.token, response.user)
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
        isLoading.value = false
    }
};

/*const onSubmitSignin = async () => {
    try {
        const response = await signin({ login: 'jdz', password: 're86K1ng@' })
        const authStore = useAuthStore()
        console.log(response)
        authStore.login(response.token, response.user)
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
        isLoading.value = false
    }
};*/
</script>

<style>
.login-form {
    display: flex;
    flex-direction: column;
    margin: auto;
    justify-content: space-between;
    width: 28rem;
    background: var(--color-surface);
    padding: 2rem;
}

.login-title {
    margin-top: 2rem;
    color: var(--color-text);
    font-size: 2rem;
}

.login-subtitle {
    margin-bottom: 4rem;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}


.login-input {
    margin-bottom: 2rem;
}

.button {
    width: 100%;
    margin-top: 2rem;
}
</style>