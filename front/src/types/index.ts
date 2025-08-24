export interface auth {
  isAuthenticated: boolean
}

export type User = {
  _id: string;
  email: string;
  login: string;
  name: string;
  firstname: string;
};

export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Order {
  _id: string
  date: Date;
  categorie: string;
  orderId: number;
  prixClient: number;
  prixAchat: number;
  margeEuro?: number;
  margePercent?: number;
  commentaires: Array<Commentaire>;
  watch: boolean;
  history: Array<History>;
}

export interface History {
  date: Date;
  user?: User;
  action: string;
}

export interface Commentaire {
  date?: Date;
  user?: User;
  commentaire: string;
}

export interface OrderPayload {
  _id?: string;
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