<template>
  <AuthLayout>
    <n-form :model="loginForm" class="space-y-4" @submit.prevent="onSubmitLogin">
      <n-form-item label="Email">
        <n-input v-model:value="loginForm.login" type="email" required />
      </n-form-item>

      <n-form-item label="Mot de passe">
        <n-input v-model:value="loginForm.password" type="password" required />
      </n-form-item>

      <n-form-item>
        <n-button type="primary" block :loading="loginMutation.isPending.value" @click="onSubmitLogin">
          Se connecter
        </n-button>
      </n-form-item>
    </n-form>
    <n-form :model="signinForm" class="space-y-4" @submit.prevent="onSubmitSignin">
      <n-form-item label="Email">
        <n-input v-model:value="signinForm.login" type="email" required />
      </n-form-item>

      <n-form-item label="Mot de passe">
        <n-input v-model:value="signinForm.password" type="password" required />
      </n-form-item>

      <n-form-item>
        <n-button type="primary" block :loading="signinMutation.isPending.value" @click="onSubmitSignin">
          S'inscrire
        </n-button>
      </n-form-item>
    </n-form>
  </AuthLayout>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useLogin, useSignin } from '../composables/useAuth';

  const loginMutation = useLogin();
  const signinMutation = useSignin();

  const loginForm = ref({ login: '', password: '' });
  const signinForm = ref({ login: '', password: '' });

  const onSubmitLogin = () => {
    loginMutation.mutate({ login: loginForm.value.login, password: loginForm.value.password });
  };
  const onSubmitSignin = () => {
    signinMutation.mutate({ login: signinForm.value.login, password: signinForm.value.password });
  };

</script>

<style scoped>
/* Ton style ici */
</style>