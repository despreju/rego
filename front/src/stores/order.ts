import { defineStore } from 'pinia'
import type { Order } from '../types';



export const useOrderStore = defineStore('order', {
  state: () => ({
    ordersList: [] as Array<Order>,
  }),

  actions: {
    saveOrders(orders: Array<Order>) {
      this.ordersList = orders.map(item => ({
        _id: item._id ?? '',
        date: item.date,
        categorie: getCategorie(item.categorie),
        orderId: item.orderId ?? '',
        prixClient: Math.abs(Number(item.prixClient ?? 0)),
        prixAchat: Math.abs(Number(item.prixAchat ?? 0)),
        margeEuro: Number((Math.abs(Number(item.prixClient ?? 0))-Math.abs(Number(item.prixAchat ?? 0))).toFixed(1)),
        margePercent: Number(((Math.abs(Number(item.prixClient ?? 0))-Math.abs(Number(item.prixAchat ?? 0)))/Math.abs(Number(item.prixClient ?? 0))*100).toFixed(1)),
        commentaires: item.commentaires ?? [],
        watch: item.watch ?? false,
        history: item.history ?? [],
      }));
    },
  },
})

function getCategorie(categorie: string): string {
  switch (categorie) {
    case 'Commandes':
      return 'Commandes';
    case 'Shopify':
      return 'Shopify';
    default:
      return 'Inconnu';
  }
}