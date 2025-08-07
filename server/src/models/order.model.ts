import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IOrder extends Document {
  date: Date;
  categorie: string;
  id: string;
  prixClient: number;
  prixAchat: number;
  commentaire: string;
}

const OrderSchema = new Schema<IOrder>({
  date: { type: Date, default: Date.now },
  categorie: { type: String, required: false },
  id: { type: String, required: false, unique: true },
  prixClient: { type: Number, required: false },
  prixAchat: { type: Number, required: false, },
  commentaire: { type: String, default: '', required: false }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);