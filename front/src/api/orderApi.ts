import { useOrderStore } from '../stores/order';
import api, { parseApiError } from './axios'

export interface OrderPayload {
  date: Date;
  categorie: string;
  id: number;
  prixClient: number;
  prixAchat: number;
  commentaire: string;
}

export interface OrderResponse {
  _id: number;
}

export const saveOrder = async (payload: OrderPayload): Promise<OrderResponse> => {
  try {
    const res = await api.post('/order/save', payload);
    return res.data
  } catch (e) {
    throw parseApiError(e)
  }
};

export const getOrders = async () => {
  try {
    const res = await api.get('/order/orders');
    const order = useOrderStore()
    order.saveOrders(res.data.map((order: OrderPayload) => ({
      ...order,
      date: order.date ? new Date(order.date) : new Date(0)
    })));
    return
  } catch (e) {
    throw parseApiError(e)
  }
};

export const removeOrder = async (id: number) => {
  try {
    await api.delete(`/order/remove/${id}`);
  } catch (e) {
    throw parseApiError(e)
  }
};

export const updateOrder = async (payload: OrderPayload) => {
  try {
    await api.put('/order/update', payload);
  } catch (e) {
    throw parseApiError(e)
  }
};