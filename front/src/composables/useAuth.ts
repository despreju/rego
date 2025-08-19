import { useMutation } from '@tanstack/vue-query';
import { login, signin, logout, check } from '../services/authService';
import type { LoginPayload, LoginResponse } from '../services/authService';
import { useAuthStore } from '../stores/auth'

export const useLogin = () => useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
        const authStore = useAuthStore()
        authStore.login(data.token)
    },
});

export const useSignin = () => useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: signin,
});

export const useLogout = () => useMutation({
    mutationFn: logout,
    onSuccess: () => {
        const auth = useAuthStore()
        auth.logout()
    },
});

export const useCheck = () => useMutation({
    mutationFn: check,
    onSuccess: () => {
        console.log('success check');
        const authStore = useAuthStore()
        authStore.check()
    },
    onError: () => {
        console.log('error check');
        const authStore = useAuthStore()
        authStore.logout()
    }   
});