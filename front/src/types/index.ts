export interface OrderToDisplay {
  id: string;
  date: string;
  categorie: string;
  orderId: number;
  prixClient: number;
  prixAchat: number;
  margeEuro: number;
  margePercent: number;
  commentaires: Array<Commentaire>;
  history: Array<History>;
  watch: boolean
}

export interface Order {
  _id: string
  date: Date;
  categorie: string;
  orderId: number;
  prixClient: number;
  prixAchat: number;
  margeEuro: number;
  margePercent: number;
  commentaires?: Array<Commentaire>;
  watch: boolean;
  history?: Array<History>;
}

export interface History {
  date: Date;
  user_id: string;
  action: string;
}

export interface Commentaire {
  date?: Date;
  user_id?: string;
  commentaire: string;
}

export interface OrderPayload {
  id?: string;
  date: Date;
  categorie: string;
  orderId: number;
  prixClient: number;
  prixAchat: number;
  commentaires: string;
  watch: boolean,
  user_id: string,
  history: string
}

export interface OrderResponse {
  _id: number;
}