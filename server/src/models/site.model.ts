import mongoose, { Schema, Document } from 'mongoose';

export interface ISite extends Document {
  name: string;
}

export const SiteSchema = new Schema<ISite>({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model<ISite>('Site', SiteSchema);