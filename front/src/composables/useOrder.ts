import { useMutation } from '@tanstack/vue-query';
import { getOrders, saveOrder } from '../services/orderService';
import type { OrderPayload, OrderResponse } from '../services/orderService';
import { useOrderStore } from '../stores/order'

export const useSaveOrder = () => useMutation<OrderResponse, Error, OrderPayload>({
    mutationFn: saveOrder,
});

export const useGetOrders = () => useMutation({
    mutationFn: getOrders,
    onSuccess: (data) => {
        const order = useOrderStore()
        order.saveOrders(data);
    },
});