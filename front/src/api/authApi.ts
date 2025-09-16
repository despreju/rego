import { useAuthStore, type User } from '../stores/auth';
import { useSiteStore } from '../stores/site';
import type { LoginPayload, LoginResponse } from '../types';
import api, { parseApiError } from './axios'

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
    const siteStore = useSiteStore()
    const res = await api.post('/auth/register', { ...payload, siteId: siteStore.currentSite._id });
    return res.data
  } catch (e) {
    throw parseApiError(e)
  }
};

export const getUsers = async (): Promise<Array<User>> => {
  try {
    const siteStore = useSiteStore()

    const res = await api.post('/auth/getUsers', { siteId: siteStore.currentSite._id });
    const auth = useAuthStore();
    auth.getUsers(res.data.users);
    return res.data
  } catch (e) {
    throw parseApiError(e)
  }
};

export const getUsersAdmin = async (): Promise<Array<User>> => {
  try {
    const res = await api.get('/auth/getUsersAdmin');
    return res.data.users
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
    const auth = useAuthStore();
    auth.check(response.data.user);
    return response.data;
  } catch (e) {
    throw parseApiError(e)
  }
};

export const updateUser = async (payload: LoginPayload) => {
  try {
    const response = await api.put('/auth/update', payload);
    return response.data;
  } catch (e) {
    throw parseApiError(e)
  }
};