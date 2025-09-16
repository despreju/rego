import { useOrderStore } from '../stores/order';
import { useSiteStore } from '../stores/site';
import type { OrderPayload, OrderResponse } from '../types';
import api, { parseApiError } from './axios'

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
    const siteStore = useSiteStore()
    const res = await api.post('/order/orders', { siteId: siteStore.currentSite._id });
    const order = useOrderStore()
    order.saveOrders(res.data.map((order: OrderPayload) => ({
      ...order,
      date: order.date ? new Date(order.date) : new Date(0),
    })));
    return
  } catch (e) {
    throw parseApiError(e)
  }
};

export const removeOrder = async (id: string) => {
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