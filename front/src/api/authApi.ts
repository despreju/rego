import { useAuthStore } from '../stores/auth';
import api, { parseApiError } from './axios'

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
  try {
    const res = await api.post('/auth/login', payload)
    return res.data
  } catch (e) {
    throw parseApiError(e)
  }
};

export const signin = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await api.post('/auth/register', payload)
    return res.data
  } catch (e) {    
    throw parseApiError(e)
  }
};

export const logout = async () => {
  try {
    const response = await api.get('/auth/logout');
    return response.data;
  } catch (e) {
    throw parseApiError(e)
  }
};

export const check = async () => {
  try {
    const response = await api.get('/auth/verify-token');
    return response.data;
  } catch (e) {
    throw parseApiError(e)
  }
};