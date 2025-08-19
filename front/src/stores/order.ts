import { defineStore } from 'pinia'
import type { OrderPayload } from '../services/orderService'

interface Order {
  date: Date | null;
  categorie: string | null;
  id: number;
  prixClient: number | null;
  prixAchat: number | null;
  commentaire: string | null;
  margeEuro: number | null;
  margePercent: number | null;
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
        margeEuro: (Math.abs(Number(item.prixClient ?? 0))-Math.abs(Number(item.prixAchat ?? 0))).toFixed(1),
        margePercent: ((Math.abs(Number(item.prixClient ?? 0))-Math.abs(Number(item.prixAchat ?? 0)))/Math.abs(Number(item.prixClient ?? 0))*100).toFixed(1),
        commentaire: item.commentaire ?? ''
      }));
    },
  },
})

function getCategorie(categorie: string | null): string {
  switch (categorie) {
    case 'Commandes':
      return 'Commandes';
    case 'Shopify':
      return 'Shopify';
    default:
      return 'Inconnu';
  }
}