import { useMutation } from '@tanstack/vue-query';
import { login, signin, logout } from '../services/authService';
import type { LoginPayload, LoginResponse } from '../services/authService';
import router from '../router';
import { useAuthStore } from '../stores/auth'

export const useLogin = () => useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
        localStorage.setItem('rego-token', data.token)
        const auth = useAuthStore()
        auth.login()
        router.push('/')
    },
});

export const useSignin = () => useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: signin,
});

export const useLogout = () => useMutation({
    mutationFn: logout,
    onSuccess: () => {
        localStorage.removeItem('rego-token')
        const auth = useAuthStore()
        auth.logout()
        router.push('/login')
    },
});