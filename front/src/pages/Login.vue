<template>
    <form class="login-form">
        <div class="title">Bienvenue !</div>
        <div class="input">
            <label>Identifiant</label>
            <input type="text" v-model="loginForm.login" required placeholder="Identifiant" />
        </div>
        <div class="input">
            <label>Mot de passe</label>
            <input type="password" v-model="loginForm.password" required placeholder="Mot de passe" />
        </div>
        <div class="button">
            <button @click.prevent="onSubmitLogin" v-if="!isLoading">Se connecter</button>
            <Loading v-else />
            <div class="error-msg" v-if="apiErr">{{ apiErr.message }}</div>
        </div>
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
        authStore.login(response.token)
    } catch (e) {
        apiErr.value = handleApiError(e)
    } finally {
        isLoading.value = false
    }
};
</script>

<style scoped>
.login-form {
    display: flex;
    flex-direction: column;
    margin: auto;
    justify-content: space-between;
    width: 28rem;
    background: #1e1f25;
    padding: 2rem;
}

.title {
    margin-bottom: 4rem;
    color: white;
    font-size: 2rem;
}

.input-password {
    margin-top: 2rem;
}

.input {
    display: flex;
    flex-direction: column;
    margin-bottom: 3rem;
}

label {
    font-family: 'Roboto', sans-serif;
    color: #c0c0c4;
    font-size: 1rem;
    text-align: left;
    margin-bottom: 0.25rem;
    font-size: 1rem;
}

input,
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
    all: unset;
    display: flex;
    text-align: left;
    flex-direction: column;
    height: 2rem;
    font-family: 'Roboto', sans-serif;
    border-radius: 0.5rem;
    font-size: 1rem;
    padding: 0.5rem 2rem;
    background: #32323B;
    color: #c0c0c4;
    box-shadow: 0 0 0 1000px #32323B inset !important;
    -webkit-box-shadow: 0 0 0 1000px #32323B inset !important;
    -webkit-text-fill-color: #c0c0c4 !important;
    transition: background-color 9999s ease-in-out 0s;
}

button {
    all: unset;
    width: 100%;
    background: #0174DC;
    color: #e8e8ec;
    height: 2rem;
    padding: 0.5rem 0;
    border-radius: 0.5rem;
    font-size: 1rem;
    margin-top: 2rem;
    cursor: pointer;
    font-weight: bold;
}

button:hover {
    background: #005BB5;
    transition: all 0.125s ease-in-out;
}

.error-msg {
    color: #bd0000;
    margin-top: 1rem;
}
</style>