import api from './axios'

export interface OrderPayload {
  date: Date | null;
  categorie: string | null;
  id: number;
  prixClient: number | null;
  prixAchat: number | null;
  commentaire: string | null;
}

export interface OrderResponse {
  _id: number;
}

export const saveOrder = async (payload: OrderPayload): Promise<OrderResponse> => {
  const response = await api.post('/order/save', payload);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/order/orders');
  return response.data.map((order: OrderPayload) => ({
    ...order,
    date: order.date ? new Date(order.date) : null
  }));
};