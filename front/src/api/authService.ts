import { useAuthStore } from '../stores/auth';
import api from './axios'

export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  login: string;
  _id: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const signin = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const logout = async () => {
  const response = await api.get('/auth/logout');
  return response.data;
};

export const check = async () => {
  try {
    const response = await api.get('/auth/verify-token');
    console.log('Success checking auth');
    const authStore = useAuthStore()
    authStore.check()
    return response.data;
  } catch (error) {
    console.log('Error checking auth:', error);
    const authStore = useAuthStore()
    authStore.logout()
  }
};