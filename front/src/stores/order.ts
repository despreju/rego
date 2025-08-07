import { defineStore } from 'pinia'
import type { OrderPayload } from '../services/orderService'

export interface order {
  ordersList: Array<OrderPayload>
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    ordersList: [] as Array<OrderPayload>,
  }),

  actions: {
    saveOrders(orders: Array<OrderPayload>) {
      this.ordersList = orders;
    },
  },
})