import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  user_id: string;
  commentaire: string;
  date: Date;
}

export interface IHistory {
  user_id: string;
  action: string;
  date: Date;
}

export interface IOrder extends Document {
  date: Date;
  categorie: string;
  orderId: number;
  prixClient: number;
  prixAchat: number;
  commentaires: IComment[];
  watch: boolean;
  history: IHistory[];
  owner: string;
}

const CommentSchema = new Schema<IComment>(
  {
    user_id: { type: String, required: false },
    commentaire: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const HistorySchema = new Schema<IHistory>(
  {
    user_id: { type: String, required: false },
    action: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>({
  date: { type: Date, default: Date.now },
  categorie: { type: String, required: false },
  orderId: { type: Number, required: true, unique: true },
  prixClient: { type: Number, required: false },
  prixAchat: { type: Number, required: false, },
  commentaires: { type: [CommentSchema], default: [] },
  watch: { type: Boolean, default: false },
  history: { type: [HistorySchema], default: [] },
  owner: { type: String, required: true }

}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);