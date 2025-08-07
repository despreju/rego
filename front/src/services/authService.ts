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
  const response = await api.get('/auth/verify-token')
  return response.data;
};