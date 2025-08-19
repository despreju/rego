import { defineStore } from 'pinia'
import type { OrderPayload } from '../services/orderService'

interface Order {
  date: Date;
  categorie: string;
  id: number;
  prixClient: number;
  prixAchat: number;
  margeEuro: number;
  margePercent: number;
  commentaire: string;
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    ordersList: [] as Array<Order>,
  }),

  actions: {
    saveOrders(orders: Array<OrderPayload>) {

      this.ordersList = orders.map(item => ({
        date: item.date,
        categorie: getCategorie(item.categorie),
        id: item.id ?? '',
        prixClient: Math.abs(Number(item.prixClient ?? 0)),
        prixAchat: Math.abs(Number(item.prixAchat ?? 0)),
        margeEuro: Number((Math.abs(Number(item.prixClient ?? 0))-Math.abs(Number(item.prixAchat ?? 0))).toFixed(1)),
        margePercent: Number(((Math.abs(Number(item.prixClient ?? 0))-Math.abs(Number(item.prixAchat ?? 0)))/Math.abs(Number(item.prixClient ?? 0))*100).toFixed(1)),
        commentaire: item.commentaire ?? ''
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