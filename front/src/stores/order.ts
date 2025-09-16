import { defineStore } from 'pinia'
import type { Order } from '../types';

function pushToList(list: Array<Order>, order: Order) {
  list.push({
    _id: order._id ?? '',
    date: order.date,
    categorie: order.categorie,
    orderId: order.orderId ?? '',
    prixClient: Math.abs(Number(order.prixClient ?? 0)),
    prixAchat: Math.abs(Number(order.prixAchat ?? 0)),
    margeEuro: Number((Math.abs(Number(order.prixClient ?? 0)) - Math.abs(Number(order.prixAchat ?? 0))).toFixed(1)),
    margePercent: Number(((Math.abs(Number(order.prixClient ?? 0)) - Math.abs(Number(order.prixAchat ?? 0))) / Math.abs(Number(order.prixClient ?? 0)) * 100).toFixed(1)),
    commentaires: order.commentaires ?? [],
    watch: order.watch ?? false,
    history: order.history ?? [],
    siteId: order.siteId ?? '',
  });
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    ordersList: [] as Array<Order>,
    adsList: [] as Array<Order>,
    shopifyList: [] as Array<Order>,
    paymentsList: [] as Array<Order>,
    orderLoading: false as boolean,
  }),

  actions: {
    saveOrders(orders: Array<Order>) {
      this.orderLoading = true;
      this.ordersList = [];
      this.adsList = [];
      this.shopifyList = [];
      this.paymentsList = [];
      orders.forEach(order => {
        if (order.categorie.toLowerCase() === 'ads') {
          pushToList(this.adsList, order);
        } else if (order.categorie.toLowerCase() === 'shopify') {
          pushToList(this.shopifyList, order);
        } else if (order.categorie.toLowerCase() === 'payment') {
          pushToList(this.paymentsList, order);
        } else if (order.categorie.toLowerCase() === 'commandes') {
          pushToList(this.ordersList, order);
        }
      });
      this.orderLoading = false;
    },
  },
})