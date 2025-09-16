export interface auth {
  isAuthenticated: boolean
}

export type User = {
  _id: string;
  email: string;
  login: string;
  name: string;
  firstname: string;
  sitesId: Array<string>;
  level: string;
};

export interface LoginPayload {
  login: string | null | undefined;
  password?: string | null | undefined;
  firstname?: string | null | undefined;
  name?: string | null | undefined;
  email?: string | null | undefined;
  level?: string | null | undefined;
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
  siteId: string;
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
  history: string,
  siteId: string
}

export interface OrderResponse {
  _id: number;
}

export interface Site {
  name: string;
  _id: string;
}